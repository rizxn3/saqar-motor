import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
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

    // Get all quotations with user details
    const quotations = await prisma.quotationRequest.findMany({
      include: {
        user: {
          select: {
            name: true,
            company_name: true,
            auth: {
              select: {
                email: true
              }
            }
          }
        },
        items: true // Include all fields from QuotationItem
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('Admin API - raw quotations:', JSON.stringify(quotations, null, 2));

    // Transform the data to include user email and format items
    const formattedQuotations = quotations.map(quotation => ({
      id: quotation.id,
      userId: quotation.userId,
      status: quotation.status,
      createdAt: quotation.createdAt,
      updatedAt: quotation.updatedAt,
      user: {
        name: quotation.user.name,
        company_name: quotation.user.company_name,
        email: quotation.user.auth.email
      },
      items: quotation.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productSnapshot: item.productSnapshot as {
          name: string;
          partNumber: string;
          manufacturer: string;
          category: string;
        }
      }))
    }));
    console.log('Admin API - formatted quotations:', JSON.stringify(formattedQuotations, null, 2));

    return NextResponse.json(formattedQuotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}
