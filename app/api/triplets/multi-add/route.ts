import { addTriplet } from "@/lib/actions/triplet.actions";
import { requireApiUser } from "@/lib/auth/current-user";
import dbConnect from "@/lib/dbConnect";
import { JSONify } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { response: unauthorized } = await requireApiUser();
  if (unauthorized) return unauthorized;

  try {
    await dbConnect();
    const triplets: TTripletFields[] = await request.json();

    const addingTripletsResponse = await Promise.all(
      triplets.map((triplet) =>
        addTriplet(null, { ...triplet, hardSetStatus: "pending" })
      )
    );

    if (!addingTripletsResponse)
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );

    return NextResponse.json(
      JSONify<TAddTripletState[]>(addingTripletsResponse)
    );

    // if (addingTripletsResponse[0].error)
    //   return NextResponse.json(
    //     { error: addingTripletsResponse.error },
    //     { status: 400 }
    //   );

    // if (addingTripletsResponse.triplet)
    //   return NextResponse.json(addingTripletResponse.triplet);
  } catch (error) {
    console.error("Error creating triplet:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
