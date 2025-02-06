"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Product {
  name: string
  partNumber: string
}

interface QuotationItem {
  id: string
  quantity: number
  unitPrice?: number
  productSnapshot: {
    name: string
    partNumber: string
    manufacturer: string
    category: string
  }
}

interface Quotation {
  id: string
  userId: string
  status: string
  createdAt: string
  updatedAt?: string
  items: QuotationItem[]
  user: {
    name: string
    company_name?: string
    email: string
  }
}

export function Orders() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [prices, setPrices] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchQuotations()
  }, [])

  const fetchQuotations = async () => {
    try {
      console.log('Fetching quotations...')
      const response = await fetch('/api/admin/quotations')
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Server error:', errorData)
        throw new Error('Failed to fetch quotations')
      }
      const data = await response.json()
      console.log('Fetched quotations:', data)
      setQuotations(data)
      
      // Initialize prices from existing data
      const initialPrices: Record<string, number> = {}
      data.forEach((quotation: Quotation) => {
        quotation.items.forEach(item => {
          if (item.unitPrice) {
            initialPrices[item.id] = item.unitPrice
          }
        })
      })
      setPrices(initialPrices)
    } catch (error) {
      console.error('Error fetching quotations:', error)
      toast.error('Failed to fetch quotations')
    } finally {
      setLoading(false)
    }
  }

  const handlePriceChange = (itemId: string, price: string) => {
    // If the input is empty, set it to empty string
    if (price === '') {
      setPrices(prev => {
        const newPrices = { ...prev }
        delete newPrices[itemId] // Remove the price entry completely
        return newPrices
      })
      return
    }

    const numPrice = parseFloat(price)
    // Allow any valid number including 0
    if (!isNaN(numPrice)) {
      setPrices(prev => ({ ...prev, [itemId]: numPrice }))
    }
  }

  const formatIndianPrice = (amount: number) => {
    // Convert to Indian format (e.g., 1,23,456.78)
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  const calculateSubtotal = (items: QuotationItem[]) => {
    return items.reduce((total, item) => {
      const price = prices[item.id] || 0
      return total + (price * item.quantity)
    }, 0)
  }

  const handleUpdateQuotation = async (quotationId: string, items: QuotationItem[]) => {
    try {
      const itemPrices = items.map(item => ({
        id: item.id,
        unitPrice: prices[item.id] || 0
      }))

      const response = await fetch(`/api/admin/quotations/${quotationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'UPDATED',
          items: itemPrices
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update quotation')
      }

      toast.success('Quotation updated successfully')
      fetchQuotations() // Refresh the list
    } catch (error) {
      console.error('Error updating quotation:', error)
      toast.error('Failed to update quotation')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Loading orders...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>View and manage customer quotation requests</CardDescription>
        </CardHeader>
        <CardContent>
          {quotations.length === 0 ? (
            <p className="text-center text-muted-foreground">No orders found</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {quotations.map((quotation) => (
                <AccordionItem key={quotation.id} value={quotation.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-4 text-left">
                      <div>
                        <p className="font-medium">{quotation.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(quotation.createdAt), "PPP")}
                        </p>
                      </div>
                      <Badge>{quotation.status}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Customer Details</h4>
                        <p>Company: {quotation.user.company_name || 'N/A'}</p>
                        <p>Email: {quotation.user.email}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Requested Items</h4>
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-left">Product</th>
                              <th className="text-left">Part Number</th>
                              <th className="text-left">Category</th>
                              <th className="text-left">Manufacturer</th>
                              <th className="text-right">Quantity</th>
                              <th className="text-right">Unit Price</th>
                              <th className="text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quotation.items.map((item) => (
                              <tr key={item.id}>
                                <td>{item.productSnapshot.name}</td>
                                <td>{item.productSnapshot.partNumber}</td>
                                <td>{item.productSnapshot.category}</td>
                                <td>{item.productSnapshot.manufacturer}</td>
                                <td className="text-right">{item.quantity}</td>
                                <td className="text-right w-32">
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={prices[item.id] ?? ''}
                                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                    className="text-right"
                                  />
                                </td>
                                <td className="text-right">
                                  {formatIndianPrice((prices[item.id] || 0) * item.quantity)}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan={6} className="text-right font-medium">Subtotal:</td>
                              <td className="text-right font-medium">
                                {formatIndianPrice(calculateSubtotal(quotation.items))}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end gap-4">
                        <p className="text-sm text-muted-foreground self-center">
                          Last updated: {quotation.status === 'UPDATED' && quotation.updatedAt ? format(new Date(quotation.updatedAt), "PPP p") : 'Not yet updated'}
                        </p>
                        <Button 
                          onClick={() => handleUpdateQuotation(quotation.id, quotation.items)}
                          disabled={!quotation.items.every(item => prices[item.id] > 0)}
                        >
                          Update Prices
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
