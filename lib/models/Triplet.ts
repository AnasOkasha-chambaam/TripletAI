import mongoose from "mongoose";

const TripletSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
    explanation: String,
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
