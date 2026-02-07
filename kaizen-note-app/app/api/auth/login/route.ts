import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { jsonError } from "@/lib/api";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { getCollections } from "@/lib/mongodb";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const { username, password } = parsed.data;
  const { users } = await getCollections();
  const user = await users.findOne({ username });

  if (!user) {
    return jsonError("Invalid username or password.", 401);
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return jsonError("Invalid username or password.", 401);
  }

  const sessionUser = {
    id: user._id.toHexString(),
    username: user.username,
  };
  const token = await createSessionToken(sessionUser);
  const response = NextResponse.json({ user: sessionUser });
  setSessionCookie(response, token, request);
  return response;
}
