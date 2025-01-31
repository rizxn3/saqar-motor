import { create } from 'zustand'

interface FiltersState {
  search: string
  categories: string[]
  manufacturers: string[]
  setSearch: (search: string) => void
  toggleCategory: (category: string) => void
  toggleManufacturer: (manufacturer: string) => void
  resetFilters: () => void
}

export const useFiltersStore = create<FiltersState>()((set) => ({
  search: '',
  categories: [],
  manufacturers: [],
  
  setSearch: (search) => set({ search }),
  
  toggleCategory: (category) =>
    set((state) => ({
      categories: state.categories.includes(category)
        ? state.categories.filter((c) => c !== category)
        : [...state.categories, category],
    })),
    
  toggleManufacturer: (manufacturer) =>
    set((state) => ({
      manufacturers: state.manufacturers.includes(manufacturer)
        ? state.manufacturers.filter((m) => m !== manufacturer)
        : [...state.manufacturers, manufacturer],
    })),
    
  resetFilters: () =>
    set({
      search: '',
      categories: [],
      manufacturers: [],
    }),
})) 