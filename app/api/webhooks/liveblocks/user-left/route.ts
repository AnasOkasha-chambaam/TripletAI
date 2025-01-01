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
  try {
    const headers = await getRouteHandlerHeaders();
    const rawBody = await req.text();

    const event = webhookHandler.verifyRequest({
      headers,
      rawBody,
    });

    // Use the event data to update your room's storage
    if (event.type === "userLeft") {
      const { roomId, userId } = event.data;

      if (userId && userIdsToIgnore.has(userId)) {
        console.log(
          `Ignoring user ${userId} from webhook request for room ${roomId}`
        );
        return NextResponse.json(
          { success: true, admin: true },
          { status: 201 }
        );
      }

      if (!userId) {
        console.log(`No userId found in webhook request for room ${roomId}`);
        return NextResponse.json(
          { error: "userId not found" },
          { status: 400 }
        );
      }

      // const roomId = "triplet-ai-room";  // Use your room ID

      const room = await liveblocks.getRoom(roomId);

      if (!room) {
        console.log(
          `Room ${roomId} not found in webhook request for user ${userId}`
        );
        return NextResponse.json({ error: "Room not found" }, { status: 400 });
      }

      const { data: roomUsers } = await liveblocks.getActiveUsers(roomId);

      const doesLeftUserHaveOtherConnections = roomUsers.some(
        (user) => user.id === userId
      );

      if (doesLeftUserHaveOtherConnections) {
        console.log(
          `User ${userId} has other connections in room ${roomId}`,
          roomUsers
        );
        return NextResponse.json(
          { success: true, otherConnections: true },
          { status: 201 }
        );
      }

      await removeUserLockedTriplet(roomId, userId);

      console.log(
        `User ${userId} left the room ${roomId}, releasing their locked triplets`
      );
      return NextResponse.json(
        { success: true, unlocked: true, userId },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
    console.log(`Error processing webhook request: ${error}`, error);
    return NextResponse.json({ error }, { status: 400 });
  }

  console.log(`No event found in webhook request`);
  return NextResponse.json({ success: true, notEvent: true }, { status: 200 });
}

export { webhookRequestHandler as GET, webhookRequestHandler as POST };
