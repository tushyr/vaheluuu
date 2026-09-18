import { NextResponse } from "next/server";
import { clearAdminSessionCookie, setDateOverrideCookie } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  setDateOverrideCookie(response, null);
  return response;
}
