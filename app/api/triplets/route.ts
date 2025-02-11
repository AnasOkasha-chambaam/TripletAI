import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Triplet from "@/lib/models/Triplet";
import { addTriplet } from "@/lib/actions/triplet.actions";

type TQuery = {
  status?: string;
  $or?: Array<
    | { input?: { $regex: string; $options: string } }
    | { output?: { $regex: string; $options: string } }
    | { instruction?: { $regex: string; $options: string } }
  >;
};

type TSort = {
  [key: string]: 1 | -1;
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
  const search = searchParams.get("search") || "";

  await dbConnect();

  const skip = (page - 1) * limit;
  const query: TQuery = status ? { status } : {};

  if (search) {
    query.$or = [
      { input: { $regex: search, $options: "i" } },
      { output: { $regex: search, $options: "i" } },
      { instruction: { $regex: search, $options: "i" } },
    ];
  }

  const sort: TSort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  try {
    const [triplets, total] = await Promise.all([
      Triplet.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Triplet.countDocuments(query),
    ]);

    return NextResponse.json({
      triplets,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error("Error fetching triplets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { instruction, input, output } = await request.json();

    const addingTripletResponse = await addTriplet(null, {
      instruction,
      input,
      output,
    });

    if (!addingTripletResponse)
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );

    if (addingTripletResponse.error)
      return NextResponse.json(
        { error: addingTripletResponse.error },
        { status: 400 }
      );

    if (addingTripletResponse.triplet)
      return NextResponse.json(addingTripletResponse.triplet);
  } catch (error) {
    console.error("Error creating triplet:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
