"use client"

import Image from "next/image"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart"
import { CartItem as CartItemType } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const [quantityInput, setQuantityInput] = useState(item.quantity.toString())

  // Update input when quantity changes from outside (e.g., from +/- buttons)
  useEffect(() => {
    setQuantityInput(item.quantity.toString())
  }, [item.quantity])

  const handleQuantityChange = (value: string) => {
    // Allow empty value or numbers
    if (value === "" || /^\d+$/.test(value)) {
      setQuantityInput(value)
    }
  }

  const handleQuantityBlur = () => {
    const newQuantity = parseInt(quantityInput)
    if (!newQuantity || newQuantity <= 0) {
      toast.error("Please enter a quantity greater than 0")
      setQuantityInput(item.quantity.toString())
      return
    }
    updateQuantity(item.id, newQuantity)
  }

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  return (
    <div className="flex gap-4 py-2">
      <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <span className="line-clamp-1 text-sm font-medium">{item.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => removeItem(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">Part #{item.partNumber}</span>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrement}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={quantityInput}
              onChange={(e) => handleQuantityChange(e.target.value)}
              onBlur={handleQuantityBlur}
              className="w-14 h-8 text-center px-1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  )
}