import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient({
  datasourceUrl: "mongodb+srv://saas_user:ic4jkxGVvb1R2pRr@cluster0.fhckqsk.mongodb.net/saas_catalog?appName=Cluster0",
})

async function main() {
  const tenants = await prisma.tenant.findMany()
  console.log("Tenants found:", tenants.map(t => `${t.name} (${t.slug})`))

  for (const tenant of tenants) {
    const email = `admin@${tenant.slug}.com`
    const hashed = await bcrypt.hash("admin123", 12)
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashed,
        name: `${tenant.name} Admin`,
        role: "CLIENT_ADMIN",
        tenantId: tenant.id,
      },
    })
    console.log(`✅ Created admin: ${email} / admin123 for ${tenant.name}`)
  }

  await prisma.$disconnect()
}

main().catch(console.error)
