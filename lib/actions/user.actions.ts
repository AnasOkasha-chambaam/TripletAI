"use server";
// /actions/triplet.actions.ts

import dbConnect from "@/lib/dbConnect";
import User from "../models/User";
import { JSONify } from "../utils";
import { auth } from "@clerk/nextjs/server";

export async function getLoggedInUser() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return { success: false, error: "User not authenticated" };
  }

  await dbConnect();

  const user = await User.findOne({ clerkId });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  return { success: true, user: JSONify<TUser>(user) };
}
