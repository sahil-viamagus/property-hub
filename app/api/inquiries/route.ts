import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { inquirySchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const inquiries = await prisma.inquiry.findMany({
      include: {
        property: {
          select: {
            title: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("[INQUIRIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = inquirySchema.parse(body);

    const inquiry = await prisma.inquiry.create({
      data: {
        ...validatedData,
        propertyId: validatedData.propertyId || null,
      },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("[INQUIRIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
