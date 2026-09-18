import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { asObject, requiredString } from "@/lib/api-validation";
import { prisma } from "@/lib/db";

const FULFILLMENT_STATUSES = new Set(["PENDING", "ORDERED", "READY", "DELIVERED"]);

export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = asObject(await req.json());
    const recordId = requiredString(body, "recordId", 128);
    const fulfillmentStatus = requiredString(body, "fulfillmentStatus", 16);
    if (!FULFILLMENT_STATUSES.has(fulfillmentStatus)) {
      return NextResponse.json({ success: false, error: "Invalid fulfillmentStatus." }, { status: 400 });
    }
    const creatorNotes = typeof body.creatorNotes === "string" ? body.creatorNotes.trim().slice(0, 500) : undefined;
    const rewardRecord = await prisma.rewardRecord.update({
      where: { id: recordId },
      data: { fulfillmentStatus, ...(creatorNotes !== undefined ? { creatorNotes } : {}) },
    });

    return NextResponse.json({
      success: true,
      rewardRecord,
    });
  } catch (error: unknown) {
    console.error("Error in /api/admin/update-gift:", error);
    return NextResponse.json(
      { success: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
