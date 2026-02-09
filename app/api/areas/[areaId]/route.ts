import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ areaId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { areaId } = await params;
    await prisma.area.delete({
      where: { id: areaId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ areaId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { areaId } = await params;
    const body = await req.json();
    const { name, state, type, order, showOnHome, isPopular } = body;

    if (order !== undefined) {
      const parsedOrder = typeof order === 'string' ? parseInt(order) : order;
      if (parsedOrder > 0) {
        const existingOrder = await prisma.area.findFirst({
          where: { 
            order: parsedOrder,
            NOT: { id: areaId }
          }
        });
        if (existingOrder) {
          return new NextResponse(`Priority order ${parsedOrder} is already taken by ${existingOrder.name}`, { status: 400 });
        }
      }
    }

    const area = await prisma.area.update({
      where: { id: areaId },
      data: { 
        name, 
        state, 
        type, 
        order: order !== undefined ? (typeof order === 'string' ? parseInt(order) : order) : undefined, 
        showOnHome,
        isPopular
      },
    });

    return NextResponse.json(area);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
