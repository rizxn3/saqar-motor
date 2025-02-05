import { Prisma, PrismaClient } from '@prisma/client'

// Define the types using Prisma namespace
export type Product = Prisma.ProductGetPayload<Record<string, never>>
export type User = Prisma.UserGetPayload<Record<string, never>>
export type UserRole = Prisma.UserRole

// Export prisma instance if needed
export const prisma = new PrismaClient() 