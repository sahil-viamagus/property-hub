import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPriceCategory } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { propertyId } = await params;
    const body = await req.json();
    
    // Update derived fields if inputs are present
    const updateData: any = { ...body };
    
    if (body.price !== undefined) {
      updateData.priceCategory = getPriceCategory(body.price);
    }
    
    if (body.title !== undefined) {
      updateData.slug = body.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    }

    const property = await prisma.property.update({
      where: { id: propertyId },
      data: updateData,
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("[PROPERTY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { propertyId } = await params;

    const property = await prisma.property.delete({
      where: { id: propertyId },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("[PROPERTY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
