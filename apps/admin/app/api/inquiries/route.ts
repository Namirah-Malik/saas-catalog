import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const inquiries = await prisma.inquiry.findMany({
    where: session.role === "SUPER_ADMIN" ? {} : { tenantId: session.tenantId! },
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(inquiries)
}
