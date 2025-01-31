export interface Product {
  id: string
  name: string
  partNumber: string
  price: number
  image: string
  inStock: boolean
  quantity: number
  category: string
  manufacturer: string
  description: string
  imageUrl?: string
}