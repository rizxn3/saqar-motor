import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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
          },
        },
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
        createdAt: 'desc',
      },
    });

    // Transform the data to match the expected format
    const transformedQuotations = quotations.map(quotation => ({
      ...quotation,
      user: {
        name: quotation.user.name,
        company_name: quotation.user.company_name,
        email: quotation.user.auth.email
      }
    }));

    return NextResponse.json(transformedQuotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}
