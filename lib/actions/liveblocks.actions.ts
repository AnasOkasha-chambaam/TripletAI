"use server";
import { enterRoom } from "@/liveblocks.server.config";
import { getLoggedInUser } from "./user.actions";
import { LiveObject } from "@liveblocks/client";

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

export async function modifyStorage(
  roomId: string,
  storageChanges: (root: LiveObject<Liveblocks["Storage"]>) => void
) {
  const roomContext = enterRoom(roomId);
  const { room } = roomContext;
  const { root } = await room.getStorage();

  // Make storage adjustments in a batch, so they all happen at once
  room.batch(() => {
    storageChanges(root);
  });

  // If storage changes are not synchronized, wait for them to finish
  if (room.getStorageStatus() !== "synchronized") {
    await room.events.storageStatus.waitUntil(
      (status) => status === "synchronized"
    );
  }

  // Leave when storage has been synchronized
  roomContext.leave();
}

export async function removeUserLockedTriplet(roomId: string, userId: string) {
  await modifyStorage(roomId, (root) => {
    const lockedTripletsLiveObject = root.get("lockedTriplets");

    const lockedTriplets = Object.values(lockedTripletsLiveObject.toObject());

    const userLockedTriplets = lockedTriplets.filter(
      (triplet) => triplet.get("lockedBy").id === userId
    );

    if (!userLockedTriplets || userLockedTriplets.length === 0) return false;

    userLockedTriplets.forEach((lt) => {
      lockedTripletsLiveObject.delete(lt.get("triplet")._id);
    });

    return true;
  });
}
