"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

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
  status: string
  createdAt: string
  items: QuotationItem[]
}

export function MyRequests() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await fetch('/api/quotations')
        if (!response.ok) {
          throw new Error('Failed to fetch quotations')
        }
        const data = await response.json()
        setQuotations(data)
      } catch (error) {
        console.error('Error fetching quotations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotations()
  }, [])

  const calculateSubtotal = (items: QuotationItem[]) => {
    return items.reduce((total, item) => {
      const price = item.unitPrice || 0
      return total + (price * item.quantity)
    }, 0)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
          <CardDescription>Loading your requests...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (quotations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
          <CardDescription>You haven't made any requests yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Requests</CardTitle>
        <CardDescription>View your quotation requests and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {quotations.map((quotation) => (
            <AccordionItem key={quotation.id} value={quotation.id}>
              <AccordionTrigger>
                <div className="flex items-center gap-4 text-left">
                  <div>
                    <p className="font-medium">Request #{quotation.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(quotation.createdAt), "PPP")}
                    </p>
                  </div>
                  <Badge variant={quotation.status === 'UPDATED' ? 'default' : 'secondary'}>
                    {quotation.status}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Product</th>
                        <th className="text-left">Part Number</th>
                        <th className="text-left">Category</th>
                        <th className="text-left">Manufacturer</th>
                        <th className="text-right">Quantity</th>
                        {quotation.status === 'UPDATED' && (
                          <>
                            <th className="text-right">Unit Price</th>
                            <th className="text-right">Total</th>
                          </>
                        )}
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
                          {quotation.status === 'UPDATED' && (
                            <>
                              <td className="text-right">${item.unitPrice?.toFixed(2)}</td>
                              <td className="text-right">
                                ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                      {quotation.status === 'UPDATED' && (
                        <tr>
                          <td colSpan={6} className="text-right font-medium">Subtotal:</td>
                          <td className="text-right font-medium">
                            ${calculateSubtotal(quotation.items).toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
