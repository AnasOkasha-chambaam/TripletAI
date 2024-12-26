"use server";
// /actions/triplet.actions.ts

import dbConnect from "@/lib/dbConnect";
import Triplet from "@/lib/models/Triplet";
import { createClient, LiveList, LiveObject } from "@liveblocks/client";
import { parse } from "csv-parse/sync";
import { JSONify } from "../utils";
import { getInitialPresence } from "./liveblocks.actions";
import { ObjectIdZodSchema } from "../schemas/helpers.zod";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
});

export async function getTripletById(tripletId: string) {
  await dbConnect();
  const triplet = await Triplet.findById(tripletId);
  return JSONify<TTriplet>(triplet);
}

export async function addTriplet(
  prevState: TAddTripletState | null,
  { instruction, input, output }: TTripletFields
): Promise<TAddTripletState> {
  await dbConnect();

  // console.log("adding triplet: ", { instruction, input, output });

  const newTriplet = new Triplet({
    instruction,
    input,
    output,
    status: "accepted",
  });

  await newTriplet.save();

  // Update Liveblocks
  // await syncTripletsWithLiveblocks();

  return { success: true, triplet: JSONify<TTriplet>(newTriplet) };
}

export async function importTriplets(
  prevState: null | TImportTripletsState,
  formData: FormData
) {
  await dbConnect();

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  const fileContent = await file.text();
  let tripletsData: TTriplet[];

  try {
    if (file.name.endsWith(".json")) {
      tripletsData = JSON.parse(fileContent);
    } else if (file.name.endsWith(".csv")) {
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      });
      tripletsData = records.map((record: TTriplet) => ({
        instruction: record.instruction,
        input: record.input,
        output: record.output,
        status: "pending",
      }));
    } else {
      return { success: false, error: "Unsupported file format" };
    }

    const importedTriplets = await Triplet.insertMany(tripletsData);

    // Update Liveblocks after import
    // await syncTripletsWithLiveblocks();

    return { success: true, count: importedTriplets.length };
  } catch (error) {
    console.error("Error importing triplets:", error);
    return { success: false, error: "Failed to import triplets" };
  }
}

export async function updateTripletStatus(
  prevState: {
    success: boolean;
    error?: string;
    tripletId?: string;
  } | null,

  { tripletId, newStatus }: { tripletId: string; newStatus: string }
) {
  await dbConnect();

  try {
    const updatedTriplet = await Triplet.findByIdAndUpdate(
      tripletId,
      { status: newStatus },
      { new: true }
    );

    // Update Liveblocks
    // await syncTripletsWithLiveblocks();

    return { success: true, tripletId: JSONify<string>(updatedTriplet._id) };
  } catch (error) {
    console.error("Error updating triplet status:", error);
    return { success: false, error: "Failed to update triplet status" };
  }
}

export async function editTriplet(
  prevState: {
    success: boolean;
    error?: string;
    triplet?: TTriplet;
  } | null,
  {
    tripletId,
    instruction,
    input,
    output,
  }: { tripletId: string; instruction: string; input: string; output: string }
) {
  await dbConnect();

  try {
    const updatedTriplet = await Triplet.findByIdAndUpdate(
      tripletId,
      { instruction, input, output, status: "accepted" },
      { new: true }
    );

    // Update Liveblocks
    // await syncTripletsWithLiveblocks();

    return { success: true, triplet: JSONify<TTriplet>(updatedTriplet) };
  } catch (error) {
    console.error("Error editing triplet:", error);
    return { success: false, error: "Failed to edit triplet" };
  }
}

export async function fetchTriplets(): Promise<TTriplet[]> {
  await dbConnect();
  const triplets = await Triplet.find({});
  return JSONify<TTriplet[]>(triplets);
}

export async function getNextTripletToLock(
  prevState: {
    nextTriplet: TTriplet | undefined;
    pendingTripletsCount: number;
  },
  tripletIdsToSkip: string[]
) {
  const validatedIds = tripletIdsToSkip.filter(
    (id) => ObjectIdZodSchema.safeParse(id).success
  );

  await dbConnect();
  const triplet = await Triplet.findOne({
    _id: { $nin: validatedIds },
    status: "pending",
  }).sort({
    createdAt: 1,
  });

  const pendingTripletsCount = await Triplet.countDocuments({
    status: "pending",
  });

  return {
    nextTriplet: JSONify<TTriplet | undefined>(triplet),
    pendingTripletsCount,
  };
}

export async function getTripletsCount(prevState: {
  pendingTripletsCount: number;
  acceptedTripletsCount: number;
  rejectedTripletsCount: number;
}) {
  await dbConnect();

  const pendingTripletsCount = await Triplet.countDocuments({
    status: "pending",
  });

  const acceptedTripletsCount = await Triplet.countDocuments({
    status: "accepted",
  });

  const rejectedTripletsCount = await Triplet.countDocuments({
    status: "rejected",
  });

  return { pendingTripletsCount, acceptedTripletsCount, rejectedTripletsCount };
}

async function syncTripletsWithLiveblocks_terminated() {
  // Terminated
  const triplets = await fetchTriplets();

  let room = client.getRoom("triplet-ai-room"); // Unique ID to try what we are going to do
  let leave = () => {};
  // console.log("from sync", room);

  if (!room) {
    const initialPresence = await getInitialPresence();

    const { room: enteredRoom, leave: leaveEnteredRoom } = client.enterRoom(
      "triplet-ai-room", // Unique ID to try what we are going to do
      {
        initialStorage: {
          lockedTriplets: new LiveObject({
            any: new LiveObject({
              triplet: {
                id: "any",

                instruction: "any",
                input: "any",
                output: "any",
                status: "pending",
                _id: "any",
                createdAt: Date.now().toLocaleString(),
                updatedAt: Date.now().toLocaleString(),
              } satisfies TTriplet,
              lockedBy: {
                id: "any",
                picture: "any",
                username: "any",
              } satisfies TLockedBy,
            }),
          }),
          releaseRequests: new LiveObject({}),
          pendingTripletsCount: 0,
        },
        initialPresence,
      }
    );

    room = enteredRoom;
    leave = leaveEnteredRoom;
  }

  const storage = await room.getStorage();

  // storage.root.set("triplets", new LiveList(triplets));

  leave();
  return;
}
