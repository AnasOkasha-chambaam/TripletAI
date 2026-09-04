import { getCurrentAppUser } from "@/lib/auth/current-user";
import { getLiveblocks } from "@/lib/liveblocks";

// No request body is read on purpose: with identifyUser (ID tokens) the room
// permissions come from the room's own defaultAccesses / usersAccesses, not
// from anything the client sends.
export async function POST() {
  const result = await getCurrentAppUser();

  // redirect() here would throw NEXT_REDIRECT; the Liveblocks client needs a
  // status code it can actually act on.
  if (!result.ok) {
    return Response.json(
      { error: result.reason },
      { status: result.reason === "unauthenticated" ? 401 : 403 }
    );
  }

  const { user } = result;

  const { status, body } = await getLiveblocks().identifyUser(
    {
      userId: user.id,
      groupIds: [],
    },
    {
      // Narrowed to TLiveblocks["UserMeta"]["info"] — the old code shipped the
      // whole row, leaking email and clerkId to every connected client.
      userInfo: {
        id: user.id,
        username: user.username,
        picture: user.picture,
      },
    }
  );

  return new Response(body, { status });
}
