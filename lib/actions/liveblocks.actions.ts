import { getLoggedInUser } from "./user.actions";

// get initial presence
export async function getInitialPresence(): Promise<TLiveblocks["Presence"]> {
  const { user: loggedInUser } = await getLoggedInUser();

  if (!loggedInUser) {
    return {
      user: null,
      skippedTripletIds: [],
    };
  }

  return {
    user: {
      id: loggedInUser.id,
      username: loggedInUser.username,
      picture: loggedInUser.picture,
    },
    skippedTripletIds: [],
  };
}
