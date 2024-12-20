// /components/real-time/HowManyUsers.tsx

"use client";

import { useOthers } from "@liveblocks/react/suspense";

export function HowManyUsers() {
  const others = useOthers();
  const userCount = others.length;
  return <div>There are {userCount} other user(s) online</div>;
}
