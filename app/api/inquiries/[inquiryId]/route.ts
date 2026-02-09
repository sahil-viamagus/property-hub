import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ inquiryId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { inquiryId } = await params;
    const body = await req.json();
    const { status } = body;

    const inquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("[INQUIRY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
