import { getInitialPresence } from "@/lib/actions/liveblocks.actions";
import { liveblocks } from "@/lib/liveblocks";
import { redirect } from "next/navigation";

export async function POST({}: Request) {
  // console.log("POST /api/liveblocks-auth", request.json());
  // Get the current user from your database
  const { user } = await getInitialPresence();

  if (!user) redirect("/unauthorized");

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.id,
      groupIds: [],
    },
    { userInfo: user }
  );

  return new Response(body, { status });
}
