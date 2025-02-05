"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/lib/store/cart"
import { toast } from "sonner"
import type { Product } from '@/lib/types/prisma'
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Plus, Minus, X } from "lucide-react"

const DEFAULT_IMAGE = 'https://placehold.co/300x300/gray/white?text=No+Image'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isSelectingQuantity, setIsSelectingQuantity] = useState(false)
  const [quantity, setQuantity] = useState("1")

  const handleQuantityChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setQuantity(value)
    }
  }

  const handleAddToQuote = () => {
    const quantityNum = parseInt(quantity)
    if (!quantityNum || quantityNum <= 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    addItem({
      id: product.id,
      partNumber: product.partNumber,
      name: product.name,
      price: 0,
      quantity: quantityNum,
      image: product.image || DEFAULT_IMAGE
    })
    toast.success("Added to quotation request")
    setIsSelectingQuantity(false)
    setQuantity("1")
  }

  const handleCancel = () => {
    setIsSelectingQuantity(false)
    setQuantity("1")
  }

  const incrementQuantity = () => {
    const current = parseInt(quantity) || 0
    setQuantity((current + 1).toString())
  }

  const decrementQuantity = () => {
    const current = parseInt(quantity) || 0
    if (current > 1) {
      setQuantity((current - 1).toString())
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="aspect-square relative">
          <Image
            src={product.image || DEFAULT_IMAGE}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="line-clamp-2 mb-2">{product.name}</CardTitle>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Part #: {product.partNumber}</p>
          <p className="text-sm font-medium text-green-600">
            {product.inStock && "In Stock"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {isSelectingQuantity ? (
          <>
            <div className="flex items-center gap-2 w-full">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={decrementQuantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="text-center h-8"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleAddToQuote}
              >
                Add
              </Button>
            </div>
          </>
        ) : (
          <Button 
            className="w-full" 
            onClick={() => setIsSelectingQuantity(true)}
          >
            Add to Quote
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}