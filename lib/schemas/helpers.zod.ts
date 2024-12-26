import { z } from "zod";
import mongoose from "mongoose";

export const ObjectIdZodSchema = z.string().refine(
  (value) => {
    return mongoose.Types.ObjectId.isValid(value);
  },
  {
    message: "Invalid MongoDB ObjectId",
  }
);
