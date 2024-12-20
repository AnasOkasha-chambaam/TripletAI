// /types/index.d.ts

/* TRIPLETS */

declare type TTripletFields = {
  id?: string;
  instruction: string;
  input: string;
  output: string;
};

declare type TTriplet = Omit<TTripletFields, "id"> & {
  _id: string;
  id: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
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
