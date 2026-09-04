"use server";
import { getCurrentAppUser } from "@/lib/auth/current-user";

// get initial presence
export async function getInitialPresence(): Promise<TLiveblocks["Presence"]> {
  const result = await getCurrentAppUser();

  if (!result.ok) {
    return {
      user: null,
      skippedTripletIds: [],
    };
  }

  return {
    user: {
      id: result.user.id,
      username: result.user.username,
      picture: result.user.picture,
    },
    skippedTripletIds: [],
  };
}
