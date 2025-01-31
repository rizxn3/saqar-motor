"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useFiltersStore } from "@/lib/store/filters"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { useCategoriesStore } from "@/lib/store/categories"
import { useManufacturersStore } from "@/lib/store/manufacturers"

const MANUFACTURERS = ['AutoCorp', 'PartsMaster', 'Elite Auto', 'TechPro']

export function ProductFilters() {
  const { 
    categories: selectedCategories, 
    manufacturers: selectedManufacturers, 
    toggleCategory, 
    toggleManufacturer,
    resetFilters 
  } = useFiltersStore()

  const { categories } = useCategoriesStore()
  const { manufacturers } = useManufacturersStore()

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={category} 
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <label 
                htmlFor={category} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Manufacturers</h3>
        <div className="space-y-2">
          {manufacturers.map((manufacturer) => (
            <div key={manufacturer} className="flex items-center space-x-2">
              <Checkbox 
                id={manufacturer} 
                checked={selectedManufacturers.includes(manufacturer)}
                onCheckedChange={() => toggleManufacturer(manufacturer)}
              />
              <label 
                htmlFor={manufacturer} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {manufacturer}
              </label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}