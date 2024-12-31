"use client";
import { LiveblocksProvider } from "@liveblocks/react";

import React from "react";

const ClientLiveblocksProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <LiveblocksProvider authEndpoint={`/api/liveblocks-auth`}>
      {children}
    </LiveblocksProvider>
  );
};

export default ClientLiveblocksProvider;
