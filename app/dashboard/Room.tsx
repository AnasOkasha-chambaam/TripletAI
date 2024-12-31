// /app/dashboard/Room.tsx

"use client";

import { EnhancedVibrantLoader } from "@/components/shared/VibrantLoader";
import { LiveObject } from "@liveblocks/client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export function Room({
  children,
  initialPresence,
  roomId,
}: {
  children: ReactNode;
  initialPresence: TLiveblocks["Presence"];
  roomId: string;
  username: string;
}) {
  // const publicApiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

  // if (!publicApiKey) {
  //   throw new Error("Missing LIVEBLOCKS_PUBLIC_KEY");
  // }

  return (
    <RoomProvider
      id={roomId}
      initialStorage={{
        lockedTriplets: new LiveObject({}),
        releaseRequests: new LiveObject({}),
        skippedTriplets: new LiveObject({}),
        answeredRequests: new LiveObject({}),
      }}
      initialPresence={initialPresence}
    >
      <ClientSideSuspense fallback={<EnhancedVibrantLoader />}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
