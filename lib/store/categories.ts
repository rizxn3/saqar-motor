import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Single initial category
const initialCategories = [
  "Engine Parts"
]

interface CategoriesState {
  categories: string[]
  addCategory: (category: string) => void
  deleteCategory: (category: string) => void
}

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set) => ({
      categories: initialCategories,
      
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category]
        })),
        
      deleteCategory: (category) =>
        set((state) => ({
          categories: state.categories.filter((c) => c !== category)
        })),
    }),
    {
      name: 'categories-storage',
    }
  )
) 