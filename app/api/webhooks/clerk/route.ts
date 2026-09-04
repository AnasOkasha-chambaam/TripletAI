// /app/api/webhooks/clerk/route.ts
//
// An optimization, not the source of truth. Users are also provisioned
// just-in-time by lib/auth/current-user.ts, so a missed or failed delivery no
// longer locks anyone out. This handler keeps Mongo in step with renames,
// avatar changes and deletions.

import { NextResponse } from "next/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import {
  displayNameOf,
  primaryEmailOfJSON,
  syncUserRow,
} from "@/lib/auth/user-sync";

export async function POST(req: Request) {
  const secret =
    process.env.CLERK_WEBHOOK_SIGNING_SECRET ?? process.env.WEBHOOK_SECRET;

  // Never throw at the top of a handler — that surfaces to Svix as an opaque 500.
  if (!secret) {
    console.error(
      "[clerk-webhook] no signing secret configured (set CLERK_WEBHOOK_SIGNING_SECRET)"
    );
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  // Svix signs the RAW bytes. Round-tripping through req.json() can change
  // them (key order, unicode escapes, number formatting) and break the signature.
  const body = await req.text();

  let evt: WebhookEvent;
  try {
    evt = new Webhook(secret).verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[clerk-webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    await dbConnect();

    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        const data = evt.data;
        const primary = primaryEmailOfJSON(data);

        // 200 on purpose: with no email we can never store this user, so a
        // retry could never succeed.
        if (!primary) {
          return NextResponse.json({ skipped: "no-email" }, { status: 200 });
        }

        const result = await syncUserRow(
          {
            clerkId: data.id,
            email: primary.email,
            username: displayNameOf(
              {
                username: data.username,
                firstName: data.first_name,
                lastName: data.last_name,
              },
              primary.email
            ),
            picture: data.image_url,
          },
          { allowRelink: primary.verified }
        );

        if (!result.ok) {
          return NextResponse.json({ skipped: result.reason }, { status: 200 });
        }
        break;
      }

      case "user.deleted": {
        // DeletedObjectJSON.id is optional in Clerk's types.
        if (evt.data.id) await User.deleteOne({ clerkId: evt.data.id });
        break;
      }

      default:
        // Unhandled event types must still 200, or Svix retries forever.
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    // 5xx so Svix DOES retry a transient database failure.
    console.error("[clerk-webhook] handler failed", evt.type, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
