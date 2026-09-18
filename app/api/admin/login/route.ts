import { NextRequest, NextResponse } from "next/server";
import {
  adminAuthConfigured,
  createAdminSession,
  setAdminSessionCookie,
  verifyAdminSecret,
} from "@/lib/admin-auth";
import { asObject } from "@/lib/api-validation";

export async function POST(request: NextRequest) {
  if (!adminAuthConfigured()) {
    return NextResponse.json(
      { success: false, error: "Admin access is not configured." },
      { status: 503 },
    );
  }

  try {
    const body = asObject(await request.json());
    if (!verifyAdminSecret(body.secret)) {
      return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    setAdminSessionCookie(response, createAdminSession());
    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }
}
