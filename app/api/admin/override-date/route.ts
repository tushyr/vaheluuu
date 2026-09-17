import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const pin = req.headers.get("x-creator-pin");
    if (pin !== "2309") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid Passkey" },
        { status: 401 }
      );
    }

    const { dateString } = await req.json(); // e.g. "2026-09-15T12:00:00.000Z" or null to reset

    const res = NextResponse.json({
      success: true,
      simulatedDate: dateString,
      message: dateString
        ? `Date simulator set to: ${dateString}`
        : "Date simulator reset to real current time.",
    });

    if (dateString) {
      res.cookies.set("p23_simulated_date", dateString, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    } else {
      res.cookies.delete("p23_simulated_date");
    }

    return res;
  } catch (error: any) {
    console.error("Error in /api/admin/override-date:", error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

