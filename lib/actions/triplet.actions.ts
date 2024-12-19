"use server";

import dbConnect from "@/lib/dbConnect";
import Triplet from "@/lib/models/Triplet";
import { JSONify } from "../utils";
import { parse } from "csv-parse/sync";
import { createClient, LiveList } from "@liveblocks/client";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
});

export async function addTriplet(
  prevState: TAddTripletState | null,
  formData: FormData
) {
  await dbConnect();

  const instruction = formData.get("instruction") as string;
  const input = formData.get("input") as string;
  const output = formData.get("output") as string;

  console.log("adding triplet: ", { instruction, input, output });

  const newTriplet = new Triplet({
    instruction,
    input,
    output,
    status: "accepted",
  });

  await newTriplet.save();

  // Update Liveblocks
  let room = client.getRoom("triplets-room");
  if (!room) {
    return { success: false, error: "Room not found" };
  }
  const storage = await room.getStorage();
  const triplets = storage.root.get("triplets") || [];

  triplets.push(JSONify<TTriplet>(newTriplet));

  storage.root.set("triplets", triplets);

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
      tripletsData = records.map((record: any) => ({
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
    const room = client.getRoom("triplets-room");

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
    const room = client.getRoom("triplets-room");

    if (!room) {
      return { success: false, error: "Room not found" };
    }

    const storage = await room.getStorage();
    const triplets = storage.root.get("triplets") || [];

    const index = triplets.findIndex(
      (t: TTriplet) => t._id === updatedTriplet._id
    );

    if (index !== -1) {
      triplets.set(index, JSONify<TTriplet>(updatedTriplet));
    }

    return { success: true, tripletId: updatedTriplet._id };
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
      { instruction, input, output },
      { new: true }
    );

    // Update Liveblocks

    const room = client.getRoom("triplets-room");

    if (!room) {
      return { success: false, error: "Room not found" };
    }

    const storage = await room.getStorage();
    const triplets = storage.root.get("triplets") || [];

    const index = triplets.findIndex(
      (t: TTriplet) => t._id === updatedTriplet._id
    );

    if (index !== -1) {
      triplets.set(index, JSONify<TTriplet>(updatedTriplet));
    }

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

export async function syncTripletsWithLiveblocks(triplets: TTriplet[]) {
  let room = client.getRoom("triplet-ai");
  // console.log("from sync", room);

  if (!room) {
    const { room: enteredRoom } = client.enterRoom("triplet-ai", {
      initialStorage: { triplets: new LiveList([]) },
    });

    room = enteredRoom;
  }

  const storage = await room.getStorage();

  storage.root.set("triplets", new LiveList(triplets));

  return;
}
