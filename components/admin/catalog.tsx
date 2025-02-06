"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2, Plus, Search, X } from "lucide-react"
import { toast } from "sonner"
import { useCategoriesStore } from "@/lib/store/categories"
import { useManufacturersStore } from "@/lib/store/manufacturers"

export function Catalog() {
  const { categories, addCategory, deleteCategory } = useCategoriesStore()
  const { manufacturers, addManufacturer, deleteManufacturer } = useManufacturersStore()
  const [categorySearch, setCategorySearch] = useState("")
  const [manufacturerSearch, setManufacturerSearch] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newManufacturer, setNewManufacturer] = useState("")

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const filteredManufacturers = manufacturers.filter(manufacturer =>
    manufacturer.toLowerCase().includes(manufacturerSearch.toLowerCase())
  )

  const handleAddCategory = () => {
    if (!newCategory) return
    if (categories.includes(newCategory)) {
      toast.error("Category already exists")
      return
    }
    addCategory(newCategory)
    setNewCategory("")
    toast.success("Category added successfully")
  }

  const handleDeleteCategory = (category: string) => {
    deleteCategory(category)
    toast.success("Category deleted successfully")
  }

  const handleAddManufacturer = () => {
    if (!newManufacturer) return
    if (manufacturers.includes(newManufacturer)) {
      toast.error("Manufacturer already exists")
      return
    }
    addManufacturer(newManufacturer)
    setNewManufacturer("")
    toast.success("Manufacturer added successfully")
  }

  const handleDeleteManufacturer = (manufacturer: string) => {
    deleteManufacturer(manufacturer)
    toast.success("Manufacturer deleted successfully")
  }

  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Categories</h2>
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {categorySearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
                  onClick={() => setCategorySearch("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category}>
                <TableCell>{category}</TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Manufacturers Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Manufacturers</h2>
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search manufacturers..."
                value={manufacturerSearch}
                onChange={(e) => setManufacturerSearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {manufacturerSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
                  onClick={() => setManufacturerSearch("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <Input
            placeholder="New manufacturer name"
            value={newManufacturer}
            onChange={(e) => setNewManufacturer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddManufacturer()}
          />
          <Button onClick={handleAddManufacturer}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Manufacturer Name</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredManufacturers.map((manufacturer) => (
              <TableRow key={manufacturer}>
                <TableCell>{manufacturer}</TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteManufacturer(manufacturer)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
