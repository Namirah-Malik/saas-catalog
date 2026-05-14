import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { tenantId, productId, name, email, phone, message } = await req.json()

  if (!tenantId || !name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      tenantId,
      productId: productId || null,
      name, email,
      phone: phone || null,
      message: message || "Inquiry submitted",
    },
  })

  return NextResponse.json(inquiry, { status: 201 })
}