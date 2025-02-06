import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers';

interface User {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  role: string;
  company_name?: string;
}

export async function POST(req: Request) {
  try {
    // Get user ID from cookie
    const userId = cookies().get('userId')?.value;
    if (!userId) {
      return NextResponse.json(
        { error: "Please login to continue", requiresLogin: true },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid session. Please login again." },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { items } = data;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Create quotation request with items
    const quotation = await prisma.quotationRequest.create({
      data: {
        userId: user.id,
        status: "PENDING",
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            productSnapshot: item.product // Use the product data sent from frontend
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(quotation);
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Get user ID from cookie
    const userId = cookies().get('userId')?.value;
    if (!userId) {
      return NextResponse.json(
        { error: "Please login to continue" },
        { status: 401 }
      );
    }

    // Get user's quotations
    const quotations = await prisma.quotationRequest.findMany({
      where: {
        userId: userId
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}
