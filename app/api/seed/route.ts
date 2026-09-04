// /app/api/seed/route.ts
//
// Fills the app with perfume instruction-tuning triplets.
//
//   GET  /api/seed              -> dry run: what is in the DB, what would change
//   POST /api/seed              -> insert anything missing, leave existing rows alone
//   POST /api/seed?reset=true   -> DELETE every triplet first, then insert
//
// Both verbs require a signed-in user. Seeding is POST-only so that a crawler,
// a link prefetch or an accidental browser visit cannot mutate the database.

import { requireApiUser } from "@/lib/auth/current-user";
import dbConnect from "@/lib/dbConnect";
import Triplet from "@/lib/models/Triplet";
import { buildPerfumeTriplets } from "@/lib/seed/perfume-triplets";
import { PERFUMES } from "@/lib/seed/perfumes";
import { type NextRequest, NextResponse } from "next/server";

async function statusCounts() {
  const [total, pending, accepted, rejected] = await Promise.all([
    Triplet.countDocuments({}),
    Triplet.countDocuments({ status: "pending" }),
    Triplet.countDocuments({ status: "accepted" }),
    Triplet.countDocuments({ status: "rejected" }),
  ]);
  return { total, pending, accepted, rejected };
}

export async function GET() {
  const { response: unauthorized } = await requireApiUser();
  if (unauthorized) return unauthorized;

  await dbConnect();

  const seeds = buildPerfumeTriplets();
  const existing = await Triplet.countDocuments({
    $or: seeds.map(({ instruction, input, output }) => ({
      instruction,
      input,
      output,
    })),
  });

  return NextResponse.json({
    dryRun: true,
    perfumesInCatalogue: PERFUMES.length,
    seedTriplets: seeds.length,
    alreadyPresent: existing,
    wouldInsert: seeds.length - existing,
    database: await statusCounts(),
    hint: "POST to this route to apply. Add ?reset=true to wipe existing triplets first.",
  });
}

export async function POST(request: NextRequest) {
  const { response: unauthorized } = await requireApiUser();
  if (unauthorized) return unauthorized;

  const reset = request.nextUrl.searchParams.get("reset") === "true";

  try {
    await dbConnect();

    const seeds = buildPerfumeTriplets();

    const deleted = reset ? (await Triplet.deleteMany({})).deletedCount ?? 0 : 0;

    // Idempotent. The key is the whole tuple, not instruction+input: the seed
    // intentionally ships more than one candidate output for some prompts (a
    // good one and a weak one marked rejected), which is exactly the pair a
    // reviewer is meant to compare. $setOnInsert means re-running never
    // clobbers a status a reviewer has already changed.
    //
    // Trade-off: if someone edits a seeded output, re-seeding treats the
    // original as missing and restores it alongside the edit.
    const result = await Triplet.bulkWrite(
      seeds.map(({ instruction, input, output, status }) => ({
        updateOne: {
          filter: { instruction, input, output },
          update: { $setOnInsert: { status } },
          upsert: true,
        },
      })),
      { ordered: false }
    );

    const inserted = result.upsertedCount ?? 0;

    return NextResponse.json({
      ok: true,
      reset,
      deleted,
      perfumesInCatalogue: PERFUMES.length,
      seedTriplets: seeds.length,
      inserted,
      skippedAsExisting: seeds.length - inserted,
      database: await statusCounts(),
    });
  } catch (error) {
    console.error("[seed] failed", error);
    return NextResponse.json(
      { error: "Seeding failed. Check the server logs." },
      { status: 500 }
    );
  }
}
