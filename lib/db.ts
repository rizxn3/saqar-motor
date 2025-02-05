import { prisma } from './prisma'
import type { Product, User, UserRole } from '.prisma/client'

export const db = {
  // Product operations
  products: {
    getAll: async () => {
      return prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
      })
    },
    
    getById: async (id: string) => {
      return prisma.product.findUnique({
        where: { id }
      })
    },
    
    create: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      return prisma.product.create({
        data
      })
    },
    
    update: async (id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
      return prisma.product.update({
        where: { id },
        data
      })
    },
    
    delete: async (id: string) => {
      return prisma.product.delete({
        where: { id }
      })
    },
    
    search: async (query: string) => {
      return prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { partNumber: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
            { manufacturer: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } }
          ]
        }
      })
    },

    getByCategory: async (category: string) => {
      return prisma.product.findMany({
        where: { category }
      })
    },

    getByManufacturer: async (manufacturer: string) => {
      return prisma.product.findMany({
        where: { manufacturer }
      })
    }
  },

  // User operations
  users: {
    getByEmail: async (email: string) => {
      return prisma.user.findUnique({
        where: { email }
      })
    },
    
    create: async (data: { 
      email: string
      password: string
      name: string
      companyName?: string
      role?: 'USER' | 'ADMIN' | 'VENDOR'
    }) => {
      return prisma.user.create({
        data
      })
    },
    
    update: async (id: string, data: Partial<Omit<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>>) => {
      return prisma.user.update({
        where: { id },
        data
      })
    }
  }
} 