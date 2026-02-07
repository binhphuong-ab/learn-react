import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { readSessionToken } from "@/lib/auth";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { getCollections } from "@/lib/mongodb";
import type { SessionUser } from "@/lib/types";

async function resolveUser(token?: string): Promise<SessionUser | null> {
  if (!token) {
    return null;
  }

  const session = await readSessionToken(token);
  if (!session || !ObjectId.isValid(session.id)) {
    return null;
  }

  const { users } = await getCollections();
  const user = await users.findOne({ _id: new ObjectId(session.id) });
  if (!user) {
    return null;
  }

  return { id: user._id.toHexString(), username: user.username };
}

export async function getRequestUser(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return resolveUser(token);
}

export async function getServerSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return resolveUser(token);
}
