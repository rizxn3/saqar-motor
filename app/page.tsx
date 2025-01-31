import { Suspense } from 'react'
import ProductGrid from '@/components/products/product-grid'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductSearch } from '@/components/products/product-search'
import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight">Auto Parts Catalog</h1>
            <ProductSearch />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            <ProductFilters />
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}