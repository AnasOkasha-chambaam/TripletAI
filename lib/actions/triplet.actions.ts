"use server";

import dbConnect from "@/lib/dbConnect";
import Triplet from "@/lib/models/Triplet";
import { JSONify } from "../utils";
import { parse } from "csv-parse/sync";

export async function addTriplet(
  prevState: TAddTripletState,
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

  console.log("importing triplets from file: ", file.name, file);

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

    console.log("imported triplets: ", tripletsData);

    const importedTriplets = await Triplet.insertMany(tripletsData);
    return { success: true, count: importedTriplets.length };
  } catch (error) {
    console.error("Error importing triplets:", error);
    return { success: false, error: "Failed to import triplets" };
  }
}

export async function updateTripletStatus(
  prevState: TUpdateTripletStatusState,
  formData: FormData
) {
  const tripletId = formData.get("id") as string;
  const newStatus = formData.get("status") as "accepted" | "rejected";

  await dbConnect();

  try {
    const updatedTriplet = await Triplet.findByIdAndUpdate(
      tripletId,
      { status: newStatus },
      { new: true }
    );
    return { success: true, tripletId: JSONify<TTriplet>(updatedTriplet)._id };
  } catch (error) {
    console.error("Error updating triplet status:", error);
    return { success: false, error: "Failed to update triplet status" };
  }
}

export async function editTriplet(
  prevState: TEditTripletState,
  formData: FormData
) {
  const id = formData.get("id") as string;
  const instruction = formData.get("instruction") as string;
  const input = formData.get("input") as string;
  const output = formData.get("output") as string;

  await dbConnect();

  try {
    const updatedTriplet = await Triplet.findByIdAndUpdate(
      id,
      { instruction, input, output, status: "accepted" },
      { new: true }
    );
    return { success: true, triplet: JSONify<TTriplet>(updatedTriplet) };
  } catch (error) {
    console.error("Error editing triplet:", error);
    return { success: false, error: "Failed to edit triplet" };
  }
}
