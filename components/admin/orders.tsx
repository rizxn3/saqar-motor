"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface Product {
  name: string
  partNumber: string
}

interface QuotationItem {
  id: string
  quantity: number
  productSnapshot: {
    name: string
    partNumber: string
    manufacturer: string
    category: string
  }
  product: Product
}

interface Quotation {
  id: string
  userId: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
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

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await fetch('/api/admin/quotations')
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
