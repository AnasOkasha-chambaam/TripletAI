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
}: {
  children: ReactNode;
  initialTriplets: TTriplet[];
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
        id="triplet-ai"
      >
        <ClientSideSuspense fallback={<div>Loading Triplets…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
