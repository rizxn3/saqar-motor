import { Prisma } from '@prisma/client'

// Define the types using Prisma namespace
export type Product = Prisma.ProductGetPayload<{}>
export type User = Prisma.usersGetPayload<{}>
export type UserRole = 'USER' | 'ADMIN' | 'VENDOR'

// Don't create a new PrismaClient instance here
// Instead, use the one from lib/prisma.ts 