import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest, setDateOverrideCookie } from "@/lib/admin-auth";
import { asObject } from "@/lib/api-validation";

export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = asObject(await req.json());
    const dateString = body.dateString;
    if (dateString !== null && (typeof dateString !== "string" || Number.isNaN(Date.parse(dateString)))) {
      return NextResponse.json({ success: false, error: "Invalid dateString." }, { status: 400 });
    }

    const res = NextResponse.json({
      success: true,
      simulatedDate: dateString,
      message: dateString
        ? `Date simulator set to: ${dateString}`
        : "Date simulator reset to real current time.",
    });

    setDateOverrideCookie(res, dateString);

    return res;
  } catch (error: unknown) {
    console.error("Error in /api/admin/override-date:", error);
    return NextResponse.json(
      { success: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
