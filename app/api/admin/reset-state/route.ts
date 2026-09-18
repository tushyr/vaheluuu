import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { asObject, requiredString } from "@/lib/api-validation";
import { prisma } from "@/lib/db";

const RESET_CONFIRMATION = "RESET";

export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

    const body = asObject(await req.json());
    const confirmation = requiredString(body, "confirmation", 16);
    if (confirmation !== RESET_CONFIRMATION) {
      return NextResponse.json(
        { success: false, error: `Type ${RESET_CONFIRMATION} to confirm.` },
        { status: 400 },
      );
    }

    const [rewards, responses, sessions] = await prisma.$transaction([
      prisma.rewardRecord.deleteMany({}),
      prisma.recipientResponse.deleteMany({}),
      prisma.recipientSession.deleteMany({}),
    ]);

    return NextResponse.json({
      success: true,
      deleted: {
        sessions: sessions.count,
        responses: responses.count,
        rewards: rewards.count,
      },
    });
  } catch (error: unknown) {
    console.error("Error in /api/admin/reset-state:", error);
    return NextResponse.json(
      { success: false, error: "Unexpected server error." },
      { status: 500 },
    );
  }
}
