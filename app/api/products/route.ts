import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const products = await db.products.getAll()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Log the incoming data for debugging
    console.log('Received product data:', data)
    
    // Ensure all required fields are present and of correct type
    const productData = {
      name: String(data.name),
      partNumber: String(data.partNumber),
      price: Number(data.price),
      category: String(data.category),
      manufacturer: String(data.manufacturer),
      description: data.description ? String(data.description) : null,
      image: data.image ? String(data.image) : null,
      inStock: Boolean(data.inStock),
      quantity: Number(data.quantity),
      // Optional fields with proper type handling
      specifications: data.specifications ? data.specifications : null,
      features: Array.isArray(data.features) ? data.features : [],
      additionalImages: Array.isArray(data.additionalImages) ? data.additionalImages : [],
      minOrderQuantity: Number(data.minOrderQuantity || 1),
      weight: data.weight ? Number(data.weight) : null,
      dimensions: data.dimensions || null,
      warranty: data.warranty ? String(data.warranty) : null,
      compatibleModels: Array.isArray(data.compatibleModels) ? data.compatibleModels : [],
      tags: Array.isArray(data.tags) ? data.tags : []
    }

    // Log the formatted data
    console.log('Formatted product data:', productData)

    // Create the product using Prisma
    const product = await prisma.product.create({
      data: productData
    })

    return NextResponse.json(product)
  } catch (error) {
    // Log the full error
    console.error('Failed to create product:', error)
    
    // Return more detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json()
    const product = await db.products.update(id, data)
    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: {
        id: id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 