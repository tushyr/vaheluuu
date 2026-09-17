import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const pin = req.headers.get("x-creator-pin");
    const expectedPin = "2309";
    if (pin !== expectedPin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid Passkey" },
        { status: 401 }
      );
    }

    const { recordId, fulfillmentStatus, creatorNotes } = await req.json();

    return NextResponse.json({
      success: true,
      rewardRecord: {
        id: recordId,
        fulfillmentStatus: fulfillmentStatus || "PENDING",
        creatorNotes: creatorNotes || "",
      },
    });
  } catch (error: any) {
    console.error("Error in /api/admin/update-gift:", error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
