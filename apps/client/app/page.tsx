import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ClientPage from "@/components/client-page"

export async function generateMetadata() {
  const headersList = await headers()
  const slug = headersList.get("x-tenant-slug") ?? ""
  const tenant = await prisma.tenant.findUnique({ where: { slug } })
  return {
    title: `${tenant?.name ?? "Product Catalog"} — Product Catalog`,
    description: `Browse products from ${tenant?.name ?? "our catalog"}`,
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

  if (!slug) {
    redirect("/login")
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: { categories: true },
  })

  if (!tenant || !tenant.isActive) {
    redirect("/login")
  }

  const products = await prisma.product.findMany({
    where: {
      tenantId: tenant.id,
      isVisible: true,
      ...(params.category ? { category: { slug: params.category } } : {}),
      ...(params.search
        ? { name: { contains: params.search, mode: "insensitive" } }
        : {}),
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
          primaryColor: tenant.primaryColor ?? undefined,
            logo: tenant.logo ?? undefined,

      }}
     products={products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? undefined,
    price: p.price ?? undefined,
    images: p.images ?? undefined,
    specifications: p.specifications as Record<string, string> ?? undefined,
    category: p.category ? { name: p.category.name } : undefined,
  }))}
/>
  )
}