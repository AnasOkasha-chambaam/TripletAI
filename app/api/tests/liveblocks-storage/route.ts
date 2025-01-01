import { removeUserLockedTriplet } from "@/lib/actions/liveblocks.actions";
import { liveblocks } from "@/lib/liveblocks";
import { NextResponse } from "next/server";

const userIdsToIgnore = new Set<string>();

userIdsToIgnore.add("_SERVICE_ACCOUNT");

async function testingLiveblocksStorage(req: Request) {
  const userId = "any-user-id";
  const roomId = "triplet-ai-room";

  if (userId && userIdsToIgnore.has(userId)) {
    console.log(
      `Ignoring user ${userId} from webhook request for room ${roomId}`
    );
    return NextResponse.json({ success: true, admin: true }, { status: 201 });
  }

  if (!userId) {
    console.log(`No userId found in webhook request for room ${roomId}`);
    return NextResponse.json({ error: "userId not found" }, { status: 400 });
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

export { testingLiveblocksStorage as GET, testingLiveblocksStorage as POST };
