"use server";

import { RoomAccesses } from "@liveblocks/node";
import { revalidatePath } from "next/cache";
import { liveblocks } from "../liveblocks";
import { JSONify } from "../utils";
import { nanoid } from "nanoid";

export const createASingleAI = async ({
  userId,
  roomTitle,
  roomId,
}: {
  userId: string;
  roomTitle: string;
  roomId?: string;
}) => {
  const currentRoomId = roomId || nanoid();

  const roomMetaData = {
    creatorId: userId,
    title: roomTitle,
  };

  const usersAccesses: RoomAccesses = {
    [userId]: ["room:write"],
  };

  const room = await liveblocks.createRoom(currentRoomId, {
    defaultAccesses: ["room:write"],
    metadata: roomMetaData,
    usersAccesses,
  });

  revalidatePath("/dashboard");

  return JSONify<typeof room>(room);
};

export const createTripletAIRoom = async ({ userId }: { userId: string }) => {
  return await createASingleAI({
    userId,
    roomTitle: "Triplet AI Room",
    roomId: "triplet-ai-room",
  });
};

export const getRoom = async ({
  roomId,
}: // userId,
{
  roomId: string;
  userId: string;
}) => {
  const room = await liveblocks.getRoom(roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  // const hasAccess = Object.keys(room.usersAccesses).includes(userId);

  // if (!hasAccess) {
  //   throw new Error("You don't have access to this room");
  // }

  return JSONify<typeof room>(room);
};
