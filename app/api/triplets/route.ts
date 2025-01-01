import dbConnect from "@/lib/dbConnect";
import Triplet from "@/lib/models/Triplet";
import { type NextRequest, NextResponse } from "next/server";

const getTriplets = async (
  status: string | null,
  page: number,
  limit: number,
  sortBy: string,
  sortOrder: "asc" | "desc"
) => {
  await dbConnect();

  const skip = (page - 1) * limit;
  const query = status ? { status } : {};
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 } as const;

  const [triplets, total] = await Promise.all([
    Triplet.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Triplet.countDocuments(query),
  ]);

  return { triplets, total };
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

  try {
    const { triplets, total } = await getTriplets(
      status,
      page,
      limit,
      sortBy,
      sortOrder
    );

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
