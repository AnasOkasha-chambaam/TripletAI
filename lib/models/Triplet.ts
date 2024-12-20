// /lib/models/Triplet.ts

import mongoose from "mongoose";

const TripletSchema = new mongoose.Schema(
  {
    instruction: { type: String, required: true },
    input: String,
    output: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export default mongoose.models.Triplet ||
  mongoose.model("Triplet", TripletSchema);
