import { removeUserLockedTriplet } from "@/lib/actions/liveblocks.actions";
import { liveblocks } from "@/lib/liveblocks";
import { WebhookHandler } from "@liveblocks/node";
import { headers as getRouteHandlerHeaders } from "next/headers";
import { NextResponse } from "next/server";

const LIVEBLOCKS_USER_LEFT_WEBhOOK_SECRET = process.env
  .LIVEBLOCKS_USER_LEFT_WEBhOOK_SECRET as string;

const userIdsToIgnore = new Set<string>();

userIdsToIgnore.add("_SERVICE_ACCOUNT");

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
      const { roomId, userId } = event.data;

      if (userId && userIdsToIgnore.has(userId)) {
        return NextResponse.json(
          { success: true, admin: true },
          { status: 201 }
        );
      }

      if (!userId) {
        return NextResponse.json(
          { error: "userId not found" },
          { status: 400 }
        );
      }

      // const roomId = "triplet-ai-room";  // Use your room ID

      const room = await liveblocks.getRoom(roomId);

      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 400 });
      }

      const { data: roomUsers } = await liveblocks.getActiveUsers(roomId);

      const doesLeftUserHaveOtherConnections = roomUsers.some(
        (user) => user.id === userId
      );

      if (doesLeftUserHaveOtherConnections) {
        return NextResponse.json(
          { success: true, otherConnections: true },
          { status: 201 }
        );
      }

      await removeUserLockedTriplet(roomId, userId);

      return NextResponse.json(
        { success: true, unlocked: true, userId },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ success: true, notEvent: true }, { status: 200 });
}

export { webhookRequestHandler as GET, webhookRequestHandler as POST };
