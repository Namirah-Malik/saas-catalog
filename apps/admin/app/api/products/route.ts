import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const products = await prisma.product.findMany({
    where: session.role === "SUPER_ADMIN" ? {} : { tenantId: session.tenantId! },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const slug = body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  const tenantId = session.role === "SUPER_ADMIN" ? body.tenantId : session.tenantId!

  if (!tenantId) {
    return NextResponse.json({ error: "Tenant required" }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      description: body.description,
      price: body.price ?? null,
      images: body.images ?? [],
      isVisible: body.isVisible ?? true,
      tenantId,
      categoryId: body.categoryId || null,
    },
  })

  return NextResponse.json(product, { status: 201 })
}
