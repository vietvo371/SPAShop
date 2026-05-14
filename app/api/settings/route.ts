import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    
    // Convert array to object
    const settingsObj = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    // Filter out sensitive info if any (though currently it's just business info)
    const publicSettings = {
      businessName: settingsObj.businessName || "Chanan Spa",
      address: settingsObj.address || "",
      phone: settingsObj.phone || "",
      email: settingsObj.email || "",
      openHours: settingsObj.openHours || "",
      mapsUrl: settingsObj.mapsUrl || "",
      voucherCode: settingsObj.voucherCode || "",
      voucherDiscount: settingsObj.voucherDiscount || "",
      voucherExpiry: settingsObj.voucherExpiry || "",
    };

    return NextResponse.json({
      success: true,
      data: publicSettings,
    });
  } catch (error) {
    console.error("Public settings API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
