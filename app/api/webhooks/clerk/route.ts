// /app/api/webhooks/clerk/route.ts

import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Error occurred -- no svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Error occurred" }, { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, username, image_url } = evt.data;

    await dbConnect();

    try {
      const existingUser = await User.findOne({
        email: email_addresses[0].email_address,
      });

      if (existingUser) {
        existingUser.clerkId = id;
        existingUser.username = username;
        existingUser.picture = image_url;
        await existingUser.save();
        console.log("User updated in database:", existingUser);
        return NextResponse.json(
          { message: "User updated successfully" },
          { status: 200 }
        );
      }

      const newUser = new User({
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username,
        picture: image_url,
      });

      await newUser.save();
      console.log("User added to database:", newUser);

      return NextResponse.json(
        { message: "User added successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error adding user to database:", error);
      return NextResponse.json(
        { error: "Error adding user to database" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
