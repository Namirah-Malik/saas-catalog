import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ClientPage from "@/components/client-page"

export async function generateMetadata() {
  const headersList = await headers()
  const slug = headersList.get("x-tenant-slug") ?? ""
  const tenant = await prisma.tenant.findUnique({ where: { slug } })
  return {
    title: `${tenant?.name ?? "Catalog"} — Product Catalog`,
    description: `Browse products from ${tenant?.name}`,
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; tenant?: string }>
}) {
  const params = await searchParams
  const headersList = await headers()
  const slug = headersList.get("x-tenant-slug") ?? params.tenant ?? ""

  if (!slug) notFound()

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: { categories: true },
  })

  if (!tenant || !tenant.isActive) notFound()

  const products = await prisma.product.findMany({
    where: {
      tenantId: tenant.id,
      isVisible: true,
      ...(params.category ? { category: { slug: params.category } } : {}),
      ...(params.search ? { name: { contains: params.search, mode: "insensitive" } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <ClientPage
      tenant={{
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        primaryColor: tenant.primaryColor,
        logo: tenant.logo,
      }}
      products={products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        images: p.images,
        isVisible: p.isVisible,
        category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
      }))}
      categories={tenant.categories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))}
    />
  )
}