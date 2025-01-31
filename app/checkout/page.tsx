"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCartStore } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

const TAX_RATE = 0.08 // 8% tax rate

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  
  const subtotal = getTotalPrice()
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const handleQuoteRequest = () => {
    // Here you would typically submit the order to your backend
    toast.success("Quote request submitted successfully!")
    clearCart()
    router.push("/")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Shop
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Number</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.partNumber}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                  <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">
                  Subtotal
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(subtotal)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">
                  Tax (8%)
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(tax)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-semibold text-lg">
                  Total
                </TableCell>
                <TableCell className="text-right font-semibold text-lg">
                  {formatPrice(total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleQuoteRequest} className="w-full md:w-auto">
            Order a Quote
          </Button>
        </div>
      </div>
    </div>
  )
}