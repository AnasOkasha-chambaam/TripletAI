// /app/dashboard/Room.tsx

"use client";

import { LiveObject } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export function Room({
  children,
  initialPresence,
}: {
  children: ReactNode;
  initialPresence: TLiveblocks["Presence"];
}) {
  const publicApiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

  if (!publicApiKey) {
    throw new Error("Missing LIVEBLOCKS_PUBLIC_KEY");
  }

  return (
    <LiveblocksProvider publicApiKey={publicApiKey}>
      <RoomProvider
        initialStorage={{
          lockedTriplets: new LiveObject({}),
          releaseRequests: new LiveObject({}),
          pendingTripletsCount: 0,
        }}
        initialPresence={initialPresence}
        id="triplet-ai-room"
      >
        <ClientSideSuspense fallback={<div>Loading Triplets…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
