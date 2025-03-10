// /types/index.d.ts

/* HELPERS */
declare type TResponsePart =
  | { type: "text"; content: string }
  | { type: "component"; name: string; data: any };

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

declare type TReleaseRequestValue = {
  requestedBy: TLockedBy;
  tripletId: string;
  message: string;
};

declare type TAnsweredRequestValue = {
  requestedBy: TLockedBy;
  tripletId: string;
  actionTakenBy: TLockedBy;
  action: "accepted" | "rejected";
  wasOwnerOffline: boolean;
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

declare type TTripletCardProps = {
  triplet: TTriplet | null;
  isLoading?: boolean;

  lockedBy?: TLockedBy;

  isActionPending?: boolean;

  isSelected?: boolean;

  onSelect?: () => void;

  onEdit?: () => void;

  statusToApply?: "accepted" | "rejected" | null;
};

/* Liveblocks */
declare type TLiveblocks = Liveblocks;
