import { LiveList, LiveObject } from "@liveblocks/client";

// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: TLiveblocks["Presence"];

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: TLiveblocks["Storage"];

    // Custom user info set when authenticating with a secret key
    UserMeta: TLiveblocks["UserMeta"];

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: TLiveblocks["RoomEvent"];
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: TLiveblocks["ThreadMetadata"];

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: TLiveblocks["RoomInfo"];
  }
}

export {};
