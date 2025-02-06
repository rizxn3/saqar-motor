"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCartStore } from "@/lib/store/cart"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import { Trash2, Minus, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useEffect, useState } from "react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const { user } = useAuth()

  const handleSubmitRequest = async () => {
    try {
      // Check if user is logged in using auth context
      if (!user) {
        localStorage.setItem('redirectAfterLogin', '/checkout')
        router.push('/login')
        return
      }

      // User is logged in, proceed with submission
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
        credentials: 'include', // Important: include credentials for cookies
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit quotation')
      }

      toast.success("Your quotation request has been submitted successfully!")
      clearCart()
      router.push("/")
    } catch (error) {
      console.error('Error submitting quotation:', error)
      toast.error("Failed to submit quotation request. Please try again.")
    }
  }

  const handleQuantityChange = (id: string, value: string) => {
    const newQuantity = parseInt(value)
    if (newQuantity && newQuantity > 0) {
      updateQuantity(id, newQuantity)
    }
  }

  // Mobile card view for each item
  const CartItem = ({ item }: { item: any }) => (
    <div className="flex flex-col p-4 border-b last:border-b-0">
      <div className="flex gap-4">
        <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Part #: {item.partNumber}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (item.quantity > 1) {
                    updateQuantity(item.id, item.quantity - 1)
                  }
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                className="w-14 h-8 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your quotation request is empty</h1>
          <Button onClick={() => router.push("/")}>Browse Products</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Request Quotation</h1>
      
      {/* Mobile view (card layout) */}
      <div className="block lg:hidden">
        <Card>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </Card>
      </div>

      {/* Desktop view (table layout) */}
      <div className="hidden lg:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Part Number</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="relative w-20 h-20 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.partNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-14 h-8 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/")}>
          Add More Items
        </Button>
        <Button onClick={handleSubmitRequest}>
          Submit Request
        </Button>
      </div>
    </div>
  )
}