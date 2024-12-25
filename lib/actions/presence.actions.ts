"use server";

import { getLoggedInUser } from "./user.actions";

// get initial presence
export async function getInitialPresence(): Promise<{
  user: TLockedBy | null;
  lockedTriplet: TTriplet | null;
  skippedTripletIds: string[];
}> {
  const { user: loggedInUser } = await getLoggedInUser();

  if (!loggedInUser) {
    return {
      user: null,
      lockedTriplet: null,
      skippedTripletIds: [],
    };
  }

  return {
    user: {
      id: loggedInUser.id,
      username: loggedInUser.username,
      picture: loggedInUser.picture,
    },
    lockedTriplet: null,
    skippedTripletIds: [],
  };
}
