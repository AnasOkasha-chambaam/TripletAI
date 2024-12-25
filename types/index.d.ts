// /types/index.d.ts

/* MONGODB */

declare type TMongoDBItem = {
  _id: string;
  id: string;
  createdAt: string;
  updatedAt: string;
};

/* TRIPLETS */

declare type TTripletFields = {
  id?: string;
  instruction: string;
  input: string;
  output: string;
};

declare type TLockedBy = {
  id: string;
  picture: string;
  username: string;
};

declare type TLockedTriplet = {
  triplet: TTriplet;
  lockedBy: TLockedBy;
};

declare type TTriplet = Omit<TTripletFields, "id"> &
  TMongoDBItem & {
    status: "pending" | "accepted" | "rejected";
  };

declare type TAddTripletState = {
  success: boolean;
  error?: string;
  triplet?: TTriplet;
} | null;

declare type TUpdateTripletStatusState = {
  success: boolean;
  error?: string;
  tripletId?: string;
} | null;

declare type TEditTripletState = {
  success: boolean;
  error?: string;
  triplet?: TTriplet;
} | null;

declare type TImportTripletsState = {
  success: boolean;
  count?: number;
  error?: string;
};

/* USER */

declare type TUserMeta = {
  id: string;

  clerkId: string;
  email: string;
  username: string;
  picture: string;
};

declare type TUser = TMongoDBItem & {
  clerkId: string;
  email: string;
  username: string;
  picture: string;
};

/* Liveblocks */
declare type TLiveblocks = {
  Presence: {
    // Example, real-time cursor coordinates
    // cursor: { x: number; y: number };
    user: TLockedBy | null;
    lockedTriplet: TTriplet | null;
    skippedTripletIds: string[];
  };

  Storage: {
    // Example, a conflict-free list
    // animals: LiveList<string>;
    triplets: LiveList<TTriplet>;
  };

  UserMeta: {
    id: string;
    info: {
      // Example properties, for useSelf, useUser, useOthers, etc.
      // name: string;
      // avatar: string;
    };
  };
  RoomEvent: {};

  ThreadMetadata: {
    // Example, attaching coordinates to a thread
    // x: number;
    // y: number;
  };

  RoomInfo: {
    // Example, rooms with a title and url
    // title: string;
    // url: string;
  };
};
