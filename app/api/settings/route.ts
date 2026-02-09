import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const settings = await prisma.settings.findUnique({
      where: { id: "global" },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { siteName, heroTitle, heroSubtitle, heroVideoUrl, contactPhone, whatsapp, email, headOffice, maintenanceMode } = body;

    const settings = await prisma.settings.upsert({
      where: { id: "global" },
      update: {
        siteName,
        heroTitle,
        heroSubtitle,
        heroVideoUrl,
        contactPhone,
        whatsapp,
        email,
        headOffice,
        maintenanceMode
      },
      create: {
        id: "global",
        siteName,
        heroTitle,
        heroSubtitle,
        heroVideoUrl,
        contactPhone,
        whatsapp,
        email,
        headOffice,
        maintenanceMode
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
