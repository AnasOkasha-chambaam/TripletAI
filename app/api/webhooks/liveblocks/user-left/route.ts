import { liveblocks } from "@/lib/liveblocks";
import { WebhookHandler } from "@liveblocks/node";
import { headers as getRouteHandlerHeaders } from "next/headers";
import { NextResponse } from "next/server";

const LIVEBLOCKS_USER_LEFT_WEBhOOK_SECRET = process.env
  .LIVEBLOCKS_USER_LEFT_WEBhOOK_SECRET as string;

// Insert your webhook secret key
const webhookHandler = new WebhookHandler(LIVEBLOCKS_USER_LEFT_WEBhOOK_SECRET);

async function webhookRequestHandler(req: Request) {
  const headers = await getRouteHandlerHeaders();
  const rawBody = await req.text();

  try {
    const event = webhookHandler.verifyRequest({
      headers,
      rawBody,
    });

    // Use the event data to update your room's storage
    if (event.type === "userLeft") {
      const {
        // roomId,
        userId,
        userInfo,
      } = event.data;

      const roomId = "triplet-ai-room";

      const room = await liveblocks.getRoom(roomId);

      if (!room) {
        throw new Error("Room not found");
      }

      const { data } = await liveblocks.getStorageDocument(roomId);
      const storage = data as unknown as TLiveblocks["Storage"];

      const { data: roomUsers } = await liveblocks.getActiveUsers(roomId);

      const doesLeftUserHaveOtherConnections = roomUsers.some(
        (user) => user.id === userId
      );

      console.log("------->", storage, roomUsers, userId);

      if (doesLeftUserHaveOtherConnections) {
        console.log("other connections");
        return NextResponse.json({ success: true }, { status: 201 });
      }

      console.log(event.data, roomId, userId, userInfo);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 400 });
  }

  NextResponse.json({ success: true }, { status: 201 });
}

export { webhookRequestHandler as GET, webhookRequestHandler as POST };
