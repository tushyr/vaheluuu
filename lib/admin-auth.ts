import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "p23_admin_session";
const DATE_OVERRIDE_COOKIE = "p23_simulated_date";
const SESSION_SECONDS = 8 * 60 * 60;

function configuredSecret(): string | null {
  const secret = process.env.P23_ADMIN_SECRET?.trim();
  return secret && secret.length >= 12 ? secret : null;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function signature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function adminAuthConfigured(): boolean {
  return configuredSecret() !== null;
}

export function verifyAdminSecret(candidate: unknown): boolean {
  const secret = configuredSecret();
  if (!secret || typeof candidate !== "string") return false;
  return timingSafeEqual(digest(candidate), digest(secret));
}

export function createAdminSession(now = Date.now()): string {
  const secret = configuredSecret();
  if (!secret) throw new Error("P23_ADMIN_SECRET is not configured.");
  const expiresAt = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${expiresAt}.${signature(expiresAt, secret)}`;
}

export function isAdminRequest(request: NextRequest, now = Date.now()): boolean {
  const secret = configuredSecret();
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!secret || !token) return false;

  const [expiresAt, suppliedSignature, extra] = token.split(".");
  if (extra || !/^\d+$/.test(expiresAt) || !suppliedSignature) return false;
  if (Number(expiresAt) <= Math.floor(now / 1000)) return false;

  const expectedSignature = signature(expiresAt, secret);
  return timingSafeEqual(digest(suppliedSignature), digest(expectedSignature));
}

export function setAdminSessionCookie(response: NextResponse, value: string): void {
  response.cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function createDateOverrideToken(dateString: string): string {
  const secret = configuredSecret();
  if (!secret) throw new Error("P23_ADMIN_SECRET is not configured.");
  const payload = Buffer.from(dateString).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

export function readDateOverride(request: NextRequest): string | null {
  const secret = configuredSecret();
  const token = request.cookies.get(DATE_OVERRIDE_COOKIE)?.value;
  if (!secret || !token) return null;

  const [payload, suppliedSignature, extra] = token.split(".");
  if (extra || !payload || !suppliedSignature) return null;
  const expectedSignature = signature(payload, secret);
  if (!timingSafeEqual(digest(suppliedSignature), digest(expectedSignature))) return null;

  try {
    const dateString = Buffer.from(payload, "base64url").toString("utf8");
    return Number.isNaN(Date.parse(dateString)) ? null : dateString;
  } catch {
    return null;
  }
}

export function setDateOverrideCookie(response: NextResponse, dateString: string | null): void {
  response.cookies.set(DATE_OVERRIDE_COOKIE, dateString ? createDateOverrideToken(dateString) : "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: dateString ? 60 * 60 * 24 * 30 : 0,
  });
}
