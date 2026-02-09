import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const areas = await prisma.area.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(areas);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, state, type, order, showOnHome, isPopular } = body;
    const parsedOrder = parseInt(order) || 0;

    if (parsedOrder > 0) {
      const existingOrder = await prisma.area.findFirst({
        where: { order: parsedOrder }
      });
      if (existingOrder) {
        return new NextResponse(`Priority order ${parsedOrder} is already taken by ${existingOrder.name}`, { status: 400 });
      }
    }

    const area = await prisma.area.create({
      data: { 
        name, 
        state: state || "Haryana",
        type: type || "DISTRICT",
        order: parsedOrder,
        showOnHome: showOnHome || false,
        isPopular: isPopular || false
      },
    });

    return NextResponse.json(area);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
