export interface Product {
  id: string
  name: string
  partNumber: string
  price: number
  category: string
  manufacturer: string
  description?: string
  image?: string
  inStock: boolean
  quantity: number
  createdAt: Date
  updatedAt: Date
} 