export interface Product {
  id: string
  name: string
  partNumber: string
  price: number
  image: string
  inStock: boolean
  category: string
  manufacturer: string
  description: string
}

interface ProductsResponse {
  items: Product[]
  nextCursor?: number
}

export async function fetchProducts({ pageParam = 0 }): Promise<ProductsResponse> {
  // Simulated API call with mock data
  const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
    id: `${pageParam}-${i + 1}`,
    name: `Auto Part ${pageParam * 12 + i + 1}`,
    partNumber: `AP-${100000 + pageParam * 12 + i}`,
    price: 49.99 + (i * 10),
    image: `https://source.unsplash.com/800x600/?auto,parts&${pageParam}-${i}`,
    inStock: Math.random() > 0.2,
    category: 'Engine Parts',
    manufacturer: 'AutoCorp',
    description: 'High-quality automotive part'
  }))

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    items: mockProducts,
    nextCursor: pageParam < 5 ? pageParam + 1 : undefined
  }
}