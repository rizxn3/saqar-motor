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
    // Get user data from auth cookie
    const cookieStore = cookies();
    const userDataCookie = cookieStore.get('user');
    
    if (!userDataCookie?.value) {
      return NextResponse.json(
        { error: "Please login to continue", requiresLogin: true },
        { status: 401 }
      );
    }

    let user: User;
    try {
      user = JSON.parse(userDataCookie.value);
      if (!user.id) {
        throw new Error('Invalid user data');
      }
    } catch (error) {
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
        items: {
          create: await Promise.all(items.map(async (item) => {
            // Get current product data for snapshot
            const product = await prisma.product.findUnique({
              where: { id: item.id },
              select: {
                name: true,
                partNumber: true,
                price: true,
                manufacturer: true,
                category: true,
              },
            });

            if (!product) {
              throw new Error(`Product not found: ${item.id}`);
            }

            return {
              productId: item.id,
              quantity: item.quantity,
              productSnapshot: product,
            };
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(quotation);
  } catch (error) {
    console.error("Error creating quotation:", error);
    return NextResponse.json(
      { error: "Failed to create quotation" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Get user data from auth cookie
    const cookieStore = cookies();
    const userDataCookie = cookieStore.get('user');
    
    if (!userDataCookie?.value) {
      return NextResponse.json(
        { error: "Please login to continue" },
        { status: 401 }
      );
    }

    let user: User;
    try {
      user = JSON.parse(userDataCookie.value);
      if (!user.id) {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid session. Please login again." },
        { status: 401 }
      );
    }

    // Get user's quotations
    const quotations = await prisma.quotationRequest.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                partNumber: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}
