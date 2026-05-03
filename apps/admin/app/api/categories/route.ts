import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const categories = await prisma.category.findMany({
    where: session.role === "SUPER_ADMIN" ? {} : { tenantId: session.tenantId! },
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!session.tenantId && session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "No tenant" }, { status: 400 })
  }

  const { name, tenantId: bodyTenantId } = await req.json()
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  const tenantId = session.role === "SUPER_ADMIN" ? bodyTenantId : session.tenantId!

  if (!tenantId) return NextResponse.json({ error: "Tenant required" }, { status: 400 })

  const category = await prisma.category.create({
    data: { name, slug, tenantId },
  })

  return NextResponse.json(category, { status: 201 })
}
