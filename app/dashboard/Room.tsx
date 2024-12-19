"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveList } from "@liveblocks/client";

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
          triplets: new LiveList([
            {
              _id: "123123123",
              id: "123123123",
              instruction: "Write a triplet",
              input: "This is a test triplet",
              output: "This is a test triplet",
              status: "pending",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]),
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
