import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/constants";
import type { SessionUser } from "@/lib/types";

const secret = process.env.JWT_SECRET ?? "dev-only-secret";
const secretBytes = new TextEncoder().encode(secret);
const expiry = process.env.JWT_EXPIRES_IN ?? "7d";

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(secretBytes);
}

export async function readSessionToken(token: string): Promise<SessionUser | null> {
  try {
    const result = await jwtVerify(token, secretBytes);
    const id = result.payload.sub;
    const username = result.payload.username;
    if (!id || typeof username !== "string") {
      return null;
    }
    return { id, username };
  } catch {
    return null;
  }
}

function shouldUseSecureCookie(request?: NextRequest): boolean {
  if (process.env.COOKIE_SECURE === "true") {
    return true;
  }
  if (process.env.COOKIE_SECURE === "false") {
    return false;
  }

  const host = request?.nextUrl.hostname ?? "";
  const protocolFromUrl = request?.nextUrl.protocol.replace(":", "");
  const forwardedProto = request?.headers.get("x-forwarded-proto") ?? undefined;
  const protocol = forwardedProto ?? protocolFromUrl;
  const isLocal =
    host === "localhost" || host === "127.0.0.1" || host === "::1";

  if (isLocal || protocol === "http") {
    return false;
  }

  return process.env.NODE_ENV === "production";
}

export function setSessionCookie(
  response: NextResponse,
  token: string,
  request?: NextRequest,
): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(
  response: NextResponse,
  request?: NextRequest,
): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    expires: new Date(0),
  });
}
