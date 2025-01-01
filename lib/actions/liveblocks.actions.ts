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
  console.log(
    `Modifying storage in room ${roomId} with changes: ${storageChanges}`
  );
  try {
    const roomContext = enterRoom(roomId);
    console.log(`Entering room ${roomId} to modify storage`);
    const { room } = roomContext;
    const { root } = await room.getStorage();

    console.log(
      `After getting root: Modifying storage in room ${roomId} with changes: ${storageChanges}`
    );

    // Make storage adjustments in a batch, so they all happen at once
    room.batch(() => {
      console.log(
        `In Batch: Modifying storage in room ${roomId} with changes: ${storageChanges}`
      );
      storageChanges(root);
    });

    // If storage changes are not synchronized, wait for them to finish
    if (room.getStorageStatus() !== "synchronized") {
      console.log(
        `Waiting for storage to synchronize in room ${roomId} with changes: ${storageChanges}`
      );
      await room.events.storageStatus.waitUntil(
        (status) => status === "synchronized"
      );
    }

    console.log(
      `Storage has been synchronized in room ${roomId} with changes: ${storageChanges}`
    );

    // Leave when storage has been synchronized
    roomContext.leave();
  } catch (error) {
    console.error("Error modifying storage", error);
  }
}

export async function removeUserLockedTriplet(roomId: string, userId: string) {
  console.log(`Removing locked triplets for user ${userId} in room ${roomId}`);
  try {
    await modifyStorage(roomId, (root) => {
      console.log(
        `Starting to remove locked triplets for user ${userId} in room ${roomId}`
      );
      const lockedTripletsLiveObject = root.get("lockedTriplets");

      const lockedTriplets = Object.values(lockedTripletsLiveObject.toObject());

      const userLockedTriplets = lockedTriplets.filter(
        (triplet) => triplet.get("lockedBy").id === userId
      );

      console.log(
        `Removing ${userLockedTriplets.length} locked triplets for user ${userId}`
      );

      if (!userLockedTriplets || userLockedTriplets.length === 0) return false;

      userLockedTriplets.forEach((lt) => {
        lockedTripletsLiveObject.delete(lt.get("triplet")._id);
      });

      return true;
    });

    console.log(
      `Successfully removed locked triplets for user ${userId} in room ${roomId}`
    );

    return true;
  } catch (error) {
    console.error(
      `Error removing locked triplets for user ${userId} in room ${roomId}`,
      error
    );
    return false;
  }
}
