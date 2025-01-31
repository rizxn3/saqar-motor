import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Move the Product interface to the top
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  partNumber: string;
  manufacturer: string;
  image: string;
  inStock: boolean;
  quantity: number;
  description: string;
  imageUrl?: string;
}

// Single dummy product
const dummyProducts: Product[] = [
  { 
    id: "1", 
    name: "Engine Oil", 
    price: 29.99, 
    category: "Engine Parts",
    partNumber: "EO-001",
    manufacturer: "AutoCorp",
    image: "/images/engine-oil.jpg",
    inStock: true,
    quantity: 50,
    description: "High-quality engine oil for all vehicle types"
  }
]

interface ProductsState {
  products: Product[]
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, updatedProduct: Product) => void
  deleteProduct: (id: string) => void
  toggleProductStock: (id: string) => void
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set) => ({
      // Initialize with dummy products
      products: dummyProducts,
      
      setProducts: (products) => set({ products }),
      
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),
        
      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) => 
            product.id === id ? updatedProduct : product
          ),
        })),
        
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
        
      toggleProductStock: (id) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, inStock: !product.inStock } : product
          ),
        })),
    }),
    {
      name: 'products-storage',
    }
  )
) 