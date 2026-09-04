"use server";

import { RoomAccesses } from "@liveblocks/node";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { JSONify } from "../utils";

const TRIPLET_AI_ROOM_TITLE = "Triplet AI Room";

const statusOf = (err: unknown): number | undefined =>
  typeof err === "object" && err !== null
    ? (err as { status?: number }).status
    : undefined;

/**
 * Not exported: a "use server" module may only export async functions meant to
 * be callable from the client, and this is shared plumbing. It deliberately
 * does NOT revalidate — getRoom() can call it during a render, where
 * revalidatePath() is not allowed.
 */
async function createRoom({
  userId,
  roomTitle,
  roomId,
}: {
  userId: string;
  roomTitle: string;
  roomId: string;
}) {
  const usersAccesses: RoomAccesses = {
    [userId]: ["room:write"],
  };

  return await liveblocks.createRoom(roomId, {
    defaultAccesses: ["room:write"],
    metadata: {
      creatorId: userId,
      title: roomTitle,
    },
    usersAccesses,
  });
}

export const createASingleAI = async ({
  userId,
  roomTitle,
  roomId,
}: {
  userId: string;
  roomTitle: string;
  roomId?: string;
}) => {
  const room = await createRoom({
    userId,
    roomTitle,
    roomId: roomId || nanoid(),
  });

  revalidatePath("/dashboard");

  return JSONify<typeof room>(room);
};

export const createTripletAIRoom = async ({ userId }: { userId: string }) => {
  return await createASingleAI({
    userId,
    roomTitle: TRIPLET_AI_ROOM_TITLE,
    roomId: "triplet-ai-room",
  });
};

/**
 * Get-or-create. liveblocks.getRoom() THROWS a 404 for a missing room rather
 * than returning null, so a fresh Liveblocks project used to 500 the dashboard.
 */
export const getRoom = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    return JSONify<typeof room>(room);
  } catch (err) {
    if (statusOf(err) !== 404) throw err;

    try {
      const created = await createRoom({
        userId,
        roomTitle: TRIPLET_AI_ROOM_TITLE,
        roomId,
      });
      return JSONify<typeof created>(created);
    } catch (createErr) {
      // 409: a concurrent request created it between our get and our create.
      if (statusOf(createErr) !== 409) throw createErr;

      const room = await liveblocks.getRoom(roomId);
      return JSONify<typeof room>(room);
    }
  }
};
