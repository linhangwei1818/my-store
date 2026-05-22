import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  const hashedPassword = await bcrypt.hash("admin123", 12)
  await prisma.user.upsert({
    where: { email: "admin@mystore.com" },
    update: {},
    create: {
      email: "admin@mystore.com",
      name: "Admin",
      hashedPassword,
      role: "ADMIN",
    },
  })
  console.log("Admin user created: admin@mystore.com / admin123")

  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Electronics", slug: "electronics", description: "Gadgets and electronic devices", sortOrder: 1 },
    }),
    prisma.category.create({
      data: { name: "Clothing", slug: "clothing", description: "Apparel and fashion", sortOrder: 2 },
    }),
    prisma.category.create({
      data: { name: "Home & Garden", slug: "home-garden", description: "Items for your home", sortOrder: 3 },
    }),
    prisma.category.create({
      data: { name: "Sports", slug: "sports", description: "Sports equipment and gear", sortOrder: 4 },
    }),
  ])
  console.log("Categories created")

  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      slug: "wireless-bluetooth-headphones",
      description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.",
      shortDescription: "Premium noise-cancelling wireless headphones",
      price: 7999,
      compareAtPrice: 9999,
      sku: "WH-001",
      inventory: 50,
      isFeatured: true,
      weight: 250,
      categoryId: categories[0].id,
    },
    {
      name: "Smart Fitness Watch",
      slug: "smart-fitness-watch",
      description: "Track your health and fitness goals with this advanced smartwatch. Heart rate, GPS, sleep tracking, 7-day battery.",
      shortDescription: "Advanced health and fitness tracking smartwatch",
      price: 14999,
      sku: "SFW-002",
      inventory: 30,
      isFeatured: true,
      weight: 45,
      categoryId: categories[0].id,
    },
    {
      name: "Classic Cotton T-Shirt",
      slug: "classic-cotton-tshirt",
      description: "Made from 100% organic cotton, this classic fit t-shirt is breathable, durable, and incredibly comfortable.",
      shortDescription: "Soft and comfortable organic cotton tee",
      price: 2999,
      compareAtPrice: 3999,
      sku: "CT-003",
      inventory: 200,
      isFeatured: true,
      weight: 180,
      categoryId: categories[1].id,
    },
    {
      name: "Denim Jeans - Slim Fit",
      slug: "denim-jeans-slim-fit",
      description: "Premium stretch denim jeans with a modern slim fit. Features classic 5-pocket styling.",
      shortDescription: "Modern slim-fit stretch denim jeans",
      price: 5999,
      sku: "DJ-004",
      inventory: 100,
      isFeatured: false,
      weight: 500,
      categoryId: categories[1].id,
    },
    {
      name: "Stainless Steel Water Bottle",
      slug: "stainless-steel-water-bottle",
      description: "Double-walled vacuum insulated water bottle. Keeps drinks cold 24h or hot 12h. BPA-free, leak-proof.",
      shortDescription: "Insulated 32oz water bottle",
      price: 2499,
      sku: "SWB-005",
      inventory: 150,
      isFeatured: true,
      weight: 350,
      categoryId: categories[2].id,
    },
    {
      name: "Plant Pot Set - Ceramic",
      slug: "plant-pot-set-ceramic",
      description: "Beautiful set of 3 ceramic plant pots with drainage holes and bamboo trays. Modern minimalist design.",
      shortDescription: "Set of 3 modern ceramic plant pots",
      price: 3999,
      compareAtPrice: 4999,
      sku: "PPS-006",
      inventory: 75,
      isFeatured: false,
      weight: 1200,
      categoryId: categories[2].id,
    },
    {
      name: "Yoga Mat - Premium",
      slug: "yoga-mat-premium",
      description: "Extra thick 6mm yoga mat with non-slip surface. Perfect for yoga, pilates, and stretching. Includes strap.",
      shortDescription: "Thick non-slip exercise yoga mat",
      price: 3499,
      sku: "YM-007",
      inventory: 80,
      isFeatured: true,
      weight: 900,
      categoryId: categories[3].id,
    },
    {
      name: "Resistance Bands Set",
      slug: "resistance-bands-set",
      description: "Complete set of 5 resistance bands with different tension levels. Includes door anchor, ankle straps, and bag.",
      shortDescription: "5-piece resistance band workout set",
      price: 1999,
      compareAtPrice: 2999,
      sku: "RBS-008",
      inventory: 120,
      isFeatured: false,
      weight: 400,
      categoryId: categories[3].id,
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log(`${products.length} products created`)
  console.log("Seed complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
