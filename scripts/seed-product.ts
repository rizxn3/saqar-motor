import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const product = await prisma.product.create({
    data: {
      name: "Test Engine Oil",
      partNumber: "EO-001",
      price: 29.99,
      category: "Engine Parts",
      manufacturer: "AutoCorp",
      description: "High-quality synthetic engine oil",
      specifications: {
        viscosity: "5W-30",
        capacity: "4L",
        type: "Synthetic"
      },
      features: ["Long-lasting", "High performance", "All-weather"],
      image: "https://placehold.co/300x300/gray/white?text=Engine+Oil",
      additionalImages: [],
      inStock: true,
      quantity: 100,
      minOrderQuantity: 1,
      weight: 4.0,
      dimensions: {
        length: 10,
        width: 10,
        height: 20
      },
      warranty: "1 year manufacturer warranty",
      compatibleModels: ["Toyota", "Honda", "Ford"],
      tags: ["engine", "oil", "maintenance"]
    }
  })

  console.log('Created sample product:', product)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 