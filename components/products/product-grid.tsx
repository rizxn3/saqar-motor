"use client"

import { ProductCard } from "./product-card"
import { useFiltersStore } from "@/lib/store/filters"
import { useProductsStore } from "@/lib/store/products"

export default function ProductGrid() {
  const { search, categories, manufacturers } = useFiltersStore()
  const { products } = useProductsStore() // Only get products, remove setProducts

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = search === '' || 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.partNumber.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = categories.length === 0 || 
        categories.includes(product.category)
      
      const matchesManufacturer = manufacturers.length === 0 || 
        manufacturers.includes(product.manufacturer)

      return matchesSearch && matchesCategory && matchesManufacturer
    })

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No products found matching your criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}