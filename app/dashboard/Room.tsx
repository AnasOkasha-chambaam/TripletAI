// /app/dashboard/Room.tsx

"use client";

import { LiveList } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export function Room({
  children,
  initialTriplets,
  initialPresence,
}: {
  children: ReactNode;
  initialTriplets: TTriplet[];
  initialPresence: TLiveblocksPresence;
}) {
  const publicApiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

  if (!publicApiKey) {
    throw new Error("Missing LIVEBLOCKS_PUBLIC_KEY");
  }

  return (
    <LiveblocksProvider publicApiKey={publicApiKey}>
      <RoomProvider
        initialStorage={{
          triplets: new LiveList(initialTriplets),
        }}
        initialPresence={initialPresence}
        id="triplet-ai"
      >
        <ClientSideSuspense fallback={<div>Loading Triplets…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
