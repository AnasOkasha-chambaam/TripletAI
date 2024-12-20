// /app/api/triplets/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Triplet from "@/lib/models/Triplet";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  await dbConnect();

  const triplets = await Triplet.find(status ? { status } : {}).sort(
    "-createdAt"
  );
  return NextResponse.json(triplets);
}

export async function POST(request: Request) {
  const body = await request.json();

  await dbConnect();

  const triplet = await Triplet.create(body);
  return NextResponse.json(triplet);
}
