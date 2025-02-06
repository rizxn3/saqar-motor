import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user from cookie
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;
    const isAdmin = cookieStore.get('isAdmin')?.value === 'true';
    
    console.log('Admin API - userId from cookie:', userId);
    console.log('Admin API - isAdmin from cookie:', isAdmin);
    
    if (!userId || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params
    const { status, items } = await request.json()
    
    console.log('Updating quotation:', { id, status, items });

    try {
      // Update quotation status
      const quotation = await prisma.quotationRequest.update({
        where: { id },
        data: { status }
      })
      console.log('Updated quotation status:', quotation);

      // Update item prices
      for (const item of items) {
        const unitPrice = parseFloat(item.unitPrice.toString());
        if (isNaN(unitPrice)) {
          console.error('Invalid price for item:', item);
          continue;
        }

        const updatedItem = await prisma.quotationItem.update({
          where: { id: item.id },
          data: { unitPrice }
        })
        console.log('Updated item price:', updatedItem);
      }

      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: "Database operation failed", details: dbError },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating quotation:', error)
    return NextResponse.json(
      { error: "Failed to update quotation" },
      { status: 500 }
    )
  }
}
