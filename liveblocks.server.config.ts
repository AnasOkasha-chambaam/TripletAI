import { createClient, LiveObject } from "@liveblocks/client";
import WebSocket from "ws";
import { liveblocks } from "./lib/liveblocks";

// 1. Creating a node client

// 2. Creating a regular client
export const serverClient = createClient({
  // 3. Authenticating inside the client
  authEndpoint: async (room) => {
    if (!room) return;
    const session = liveblocks.prepareSession(
      // 4. Using a specific userId for all server changes
      "_SERVICE_ACCOUNT",
      {
        userInfo: {
          username: "SERVICE_ACCOUNT",
          id: "_SERVICE_ACCOUNT",
          picture: "https://triplet-ai.vercel.app/logo.svg",
        },
      }
    );
    session.allow(room, session.FULL_ACCESS);
    const { body } = await session.authorize();
    return JSON.parse(body);
  },

  // 5. Adding polyfills
  polyfills: {
    fetch: fetch,
    WebSocket,
  },
});

// 6. Creating a typed enter room function
export const enterRoom = (roomId: string) => {
  return serverClient.enterRoom(roomId, {
    // Match the options in your browser code
    initialPresence() {
      return {
        user: {
          id: "_SERVICE_ACCOUNT",
          username: "SERVICE_ACCOUNT",
          picture: "https://triplet-ai.vercel.app/logo.svg",
        },
        skippedTripletIds: [],
      };
    },
    initialStorage() {
      return {
        lockedTriplets: new LiveObject({}),
        skippedTriplets: new LiveObject({}),
        releaseRequests: new LiveObject({}),
        answeredRequests: new LiveObject({}),
        // pendingTripletsCount: 0,
      };
    },
  });
};
