import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const tenants = await prisma.tenant.findMany({
    include: {
      _count: {
        select: { products: true, users: true, inquiries: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(tenants)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { name, slug, primaryColor } = await req.json()

  const existing = await prisma.tenant.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: "Slug already taken" }, { status: 409 })
  }

  const tenant = await prisma.tenant.create({
    data: { name, slug, primaryColor: primaryColor ?? "#6366f1" },
  })

  return NextResponse.json(tenant, { status: 201 })
}
