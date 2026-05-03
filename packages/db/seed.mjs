import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient({
  datasourceUrl: "mongodb+srv://saas_user:ic4jkxGVvb1R2pRr@cluster0.fhckqsk.mongodb.net/saas_catalog?appName=Cluster0",
})

async function main() {
  const hashed = await bcrypt.hash("admin123", 12)

  const user = await prisma.user.upsert({
    where: { email: "super@admin.com" },
    update: {},
    create: {
      email: "super@admin.com",
      password: hashed,
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
  })

  console.log("✅ Super admin created!")
  console.log("📧 Email: super@admin.com")
  console.log("🔑 Password: admin123")
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
