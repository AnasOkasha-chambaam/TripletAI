// /lib/auth/current-user.ts
//
// The request-scoped read path. Self-healing: a signed-in user whose Mongo row
// is missing gets one provisioned here instead of being redirected to
// /unauthorized forever.
//
// Deliberately NOT "use server" — see the note in user-sync.ts.

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cache } from "react";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import { JSONify } from "@/lib/utils";
import { displayNameOf, primaryEmailOf, syncUserRow } from "./user-sync";

export type TAppUserFailure =
  | "unauthenticated" // no Clerk session         -> sign in
  | "no-email" // Clerk account without an email  -> /unauthorized
  | "not-allowed" // not on ALLOWED_EMAILS        -> /unauthorized
  | "email-taken" // unverified email, can't relink -> /unauthorized
  | "unavailable"; // Mongo/Clerk is down          -> 503, NOT "unauthorized"

export type TAppUserResult =
  | { ok: true; user: TUser }
  | { ok: false; reason: TAppUserFailure };

/**
 * An ABSENT or empty ALLOWED_EMAILS means "allow everyone", loudly.
 *
 * The previous behaviour (absent -> empty list -> block everyone with no way
 * back in) is the deployment footgun this rewrite exists to remove. Clerk
 * itself is the real gate; this is a second, optional filter.
 */
export function isEmailAllowed(email: string): boolean {
  const raw = process.env.ALLOWED_EMAILS;

  if (raw === undefined || raw.trim() === "") {
    console.warn(
      "[auth] ALLOWED_EMAILS is not set — allowing every signed-in user. " +
        "Set it in your environment to restrict access."
    );
    return true;
  }

  if (raw.trim() === "*") return true;

  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.trim().toLowerCase());
}

/**
 * Hot path:  one indexed findOne. No Clerk API call.
 * Cold path: currentUser() + one write, only when the row is missing.
 *
 * cache() dedupes this across a single render pass, so the dashboard calling
 * both getInitialPresence() and the page guard costs one round trip, not two.
 */
export const getCurrentAppUser = cache(async (): Promise<TAppUserResult> => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { ok: false, reason: "unauthenticated" };

  try {
    await dbConnect();

    const existing = await User.findOne({ clerkId });
    if (existing) {
      // Re-checked every request: an address can be removed from the allowlist
      // long after the row was provisioned.
      if (!isEmailAllowed(existing.email)) {
        return { ok: false, reason: "not-allowed" };
      }
      return { ok: true, user: JSONify<TUser>(existing) };
    }

    // Cold path — provision now rather than dead-ending on /unauthorized.
    const clerkUser = await currentUser();
    if (!clerkUser) return { ok: false, reason: "unauthenticated" };

    const primary = primaryEmailOf(clerkUser);
    if (!primary) return { ok: false, reason: "no-email" };
    if (!isEmailAllowed(primary.email)) {
      return { ok: false, reason: "not-allowed" };
    }

    const synced = await syncUserRow(
      {
        clerkId,
        email: primary.email,
        username: displayNameOf(clerkUser, primary.email),
        picture: clerkUser.imageUrl,
      },
      // Relinking by email transfers an existing row to a new Clerk account.
      // Only do that when Clerk has actually verified the address.
      { allowRelink: primary.verified }
    );

    if (!synced.ok) return { ok: false, reason: synced.reason };

    console.info("[auth] provisioned missing user row for", clerkId);
    return { ok: true, user: JSONify<TUser>(synced.user) };
  } catch (err) {
    // A DB outage must not masquerade as "you are not authorized".
    console.error("[auth] getCurrentAppUser failed", err);
    return { ok: false, reason: "unavailable" };
  }
});

/** Guard for API route handlers. Returns a real status code, never a redirect. */
export async function requireApiUser(): Promise<
  { user: TUser; response: null } | { user: null; response: NextResponse }
> {
  const result = await getCurrentAppUser();
  if (result.ok) return { user: result.user, response: null };

  const status =
    result.reason === "unauthenticated"
      ? 401
      : result.reason === "unavailable"
      ? 503
      : 403;

  return {
    user: null,
    response: NextResponse.json({ error: result.reason }, { status }),
  };
}
