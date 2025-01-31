import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Single initial manufacturer
const initialManufacturers = [
  'AutoCorp'
]

interface ManufacturersState {
  manufacturers: string[]
  addManufacturer: (manufacturer: string) => void
  deleteManufacturer: (manufacturer: string) => void
}

export const useManufacturersStore = create<ManufacturersState>()(
  persist(
    (set) => ({
      manufacturers: initialManufacturers,
      
      addManufacturer: (manufacturer) =>
        set((state) => ({
          manufacturers: [...state.manufacturers, manufacturer]
        })),
        
      deleteManufacturer: (manufacturer) =>
        set((state) => ({
          manufacturers: state.manufacturers.filter((m) => m !== manufacturer)
        })),
    }),
    {
      name: 'manufacturers-storage',
    }
  )
) 