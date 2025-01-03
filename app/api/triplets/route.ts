import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Triplet from "@/lib/models/Triplet";

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
    const body = await request.json();
    await dbConnect();
    const triplet = await Triplet.create(body);
    return NextResponse.json(triplet);
  } catch (error) {
    console.error("Error creating triplet:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
