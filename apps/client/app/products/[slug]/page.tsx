import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductDetailClient from "@/components/product-detail-client"

export async function generateMetadata({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tenant?: string }>
}) {
  const { slug } = await params
  const { tenant: tenantParam } = await searchParams
  const headersList = await headers()
  const tenantSlug = headersList.get("x-tenant-slug") ?? tenantParam ?? ""
  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } })
  const product = await prisma.product.findFirst({
    where: { slug, tenantId: tenant?.id },
  })
  return {
    title: `${product?.name ?? "Product"} — ${tenant?.name ?? "Catalog"}`,
    description: product?.description?.slice(0, 155),
  }
}

export default async function ProductPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tenant?: string }>
}) {
  const { slug } = await params
  const { tenant: tenantParam } = await searchParams
  const headersList = await headers()
  const tenantSlug = headersList.get("x-tenant-slug") ?? tenantParam ?? ""

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: { categories: true },
  })
  if (!tenant) notFound()

  const product = await prisma.product.findFirst({
    where: { slug, tenantId: tenant.id, isVisible: true },
    include: { category: true },
  })
  if (!product) notFound()

  const related = await prisma.product.findMany({
    where: {
      tenantId: tenant.id,
      isVisible: true,
      id: { not: product.id },
      ...(product.categoryId ? { categoryId: product.categoryId } : {}),
    },
    include: { category: true },
    take: 4,
  })

  return (
    <ProductDetailClient
      tenant={{
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        primaryColor: tenant.primaryColor,
        logo: tenant.logo,
      }}
      product={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        images: product.images,
        brochureUrl: product.brochureUrl,
        specifications: product.specifications as Record<string, string> | null,
        category: product.category
          ? { name: product.category.name, slug: product.category.slug }
          : null,
      }}
      related={related.map(r => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        price: r.price,
        images: r.images,
        description: r.description,
        category: r.category ? { name: r.category.name, slug: r.category.slug } : null,
      }))}
    />
  )
}