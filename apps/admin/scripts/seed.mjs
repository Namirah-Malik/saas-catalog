import { PrismaClient } from "@prisma/client"
import { createHash } from "crypto"

const prisma = new PrismaClient({
  datasourceUrl: "mongodb+srv://saas_user:ic4jkxGVvb1R2pRr@cluster0.fhckqsk.mongodb.net/saas_catalog?appName=Cluster0",
})

// Simple hash since we can't use bcrypt in .mjs easily
async function hashPassword(password) {
  const bcrypt = await import("bcryptjs")
  return bcrypt.default.hash(password, 12)
}

async function main() {
  const hashed = await hashPassword("admin123")

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

  console.log("Super admin created!")
  console.log("Email: super@admin.com")
  console.log("Password: admin123")
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
