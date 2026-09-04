// /lib/auth/user-sync.ts
//
// The ONE place a User row is written. Imported by both the just-in-time
// provisioning path (lib/auth/current-user.ts) and the Clerk webhook, so the
// two can never disagree about what a user row looks like.
//
// Deliberately NOT "use server" — these are plain server helpers, not Server
// Actions. Marking them would publish them as callable endpoints.

import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import type { User as ClerkUser, UserJSON } from "@clerk/nextjs/server";

export type TUserSyncFields = {
  clerkId: string;
  email: string;
  username: string;
  picture: string;
};

export type TSyncResult =
  | { ok: true; user: TUser }
  // A row already owns this email but belongs to a different clerkId, and we
  // were not allowed to relink it (the email wasn't verified).
  | { ok: false; reason: "email-taken" };

type TPrimaryEmail = { email: string; verified: boolean };

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isDuplicateKeyError = (err: unknown) =>
  typeof err === "object" &&
  err !== null &&
  (err as { code?: number }).code === 11000;

/* ---------- field extraction ---------- */
// Two variants because the SDK hands us camelCase resources while webhook
// payloads arrive as snake_case JSON.

export function primaryEmailOf(user: ClerkUser): TPrimaryEmail | null {
  const primary =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId) ??
    user.emailAddresses[0];

  // A phone-only or certain OAuth accounts have no email at all. The old
  // middleware crashed here with a 500.
  if (!primary) return null;

  return {
    email: normalizeEmail(primary.emailAddress),
    verified: primary.verification?.status === "verified",
  };
}

export function primaryEmailOfJSON(data: UserJSON): TPrimaryEmail | null {
  const primary =
    data.email_addresses.find((e) => e.id === data.primary_email_address_id) ??
    data.email_addresses[0];

  if (!primary) return null;

  return {
    email: normalizeEmail(primary.email_address),
    verified: primary.verification?.status === "verified",
  };
}

/**
 * Clerk returns username: null when usernames are disabled on the instance,
 * which this app never asks for — so fall back rather than storing null and
 * rendering "By: null" in the triplet cards.
 */
export function displayNameOf(
  profile: {
    username: string | null;
    firstName: string | null;
    lastName: string | null;
  },
  email: string
): string {
  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return profile.username?.trim() || fullName || email.split("@")[0] || "user";
}

/* ---------- the idempotent, concurrency-safe write ---------- */

/**
 * Order matters:
 *   1. match on clerkId -> ordinary update
 *   2. match on email   -> RELINK. The Clerk account was recreated, so the row
 *                          exists under a stale clerkId. Reusing the row keeps
 *                          the Mongo _id, which is the Liveblocks userId and
 *                          the key in the room's usersAccesses.
 *   3. insert
 *
 * Both unique indexes (clerkId, email) can raise E11000 when a concurrent
 * request wins the race between our read and our write, so we re-read the
 * winner instead of failing.
 */
export async function syncUserRow(
  fields: TUserSyncFields,
  { allowRelink = true }: { allowRelink?: boolean } = {}
): Promise<TSyncResult> {
  await dbConnect();

  const write = async (): Promise<TSyncResult> => {
    const byClerkId = await User.findOneAndUpdate(
      { clerkId: fields.clerkId },
      { $set: fields },
      { new: true }
    );
    if (byClerkId) return { ok: true, user: byClerkId };

    const byEmail = await User.findOne({ email: fields.email });
    if (byEmail) {
      if (!allowRelink) return { ok: false, reason: "email-taken" };

      const relinked = await User.findOneAndUpdate(
        { _id: byEmail._id },
        { $set: fields },
        { new: true }
      );
      return { ok: true, user: relinked };
    }

    return { ok: true, user: await User.create(fields) };
  };

  try {
    return await write();
  } catch (err) {
    if (!isDuplicateKeyError(err)) throw err;

    // Someone else created the row between our findOne and our insert.
    const winner = await User.findOne({ clerkId: fields.clerkId });
    if (winner) return { ok: true, user: winner };

    // The duplicate was on email, not clerkId — replay once, now that the row
    // exists and the relink branch can find it.
    return await write();
  }
}
