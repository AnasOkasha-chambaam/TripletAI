"use server";
// /actions/user.actions.ts

import {
  getCurrentAppUser,
  type TAppUserFailure,
} from "@/lib/auth/current-user";

/**
 * Kept for backward compatibility with existing call sites.
 * Prefer getCurrentAppUser() directly — it distinguishes failure reasons
 * (e.g. "the database is unreachable" vs. "you are not allowed in").
 */
export async function getLoggedInUser(): Promise<{
  success: boolean;
  user?: TUser;
  error?: TAppUserFailure;
}> {
  const result = await getCurrentAppUser();

  if (!result.ok) return { success: false, error: result.reason };

  return { success: true, user: result.user };
}
