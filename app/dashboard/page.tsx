// /app/dashboard/page.tsx

import AcceptedTriplets from "@/components/AcceptedTriplets";
import { AddOrEditTripletDialog } from "@/components/AddOrEditTripletDialog";
import { ImportTripletsDialog } from "@/components/ImportTripletsDialog";
import PendingTriplets from "@/components/PendingTriplets";
import RejectedTriplets from "@/components/RejectedTriplets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitialPresence } from "@/lib/actions/liveblocks.actions";
import { CircleCheckIcon, CircleDotIcon, CircleXIcon } from "lucide-react";
import { Room } from "./Room";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { createTripletAIRoom, getRoom } from "@/lib/actions/room.actions";

export default async function Dashboard({}: {
  params: Promise<{
    // roomId: string;
  }>;
}) {
  const initialPresence = await getInitialPresence();

  const { user } = await getLoggedInUser();

  if (!user) {
    return redirect("/login");
  }

  const room = await getRoom({
    roomId: "triplet-ai-room", // TODO: Use the dynamic room id here
    userId: user.id,
  });

  return (
    <Room initialPresence={initialPresence} roomId={room.id} username={user.id}>
      <div className="min-h-screen overflow-hidden pb-28">
        <section className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-muted-foreground">
              Triplets
            </h2>
            <div className="space-x-4">
              <ImportTripletsDialog />
              <AddOrEditTripletDialog />
            </div>
          </div>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="pending">
                <CircleDotIcon className="size-4 mr-2 text-yellow-600" />{" "}
                Pending
              </TabsTrigger>
              <TabsTrigger value="accepted">
                <CircleCheckIcon className="size-4 mr-2 text-green-600" />
                Accepted
              </TabsTrigger>
              <TabsTrigger value="rejected">
                <CircleXIcon className="size-4 mr-2 text-red-600" />
                Rejected
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <PendingTriplets />
            </TabsContent>
            <TabsContent value="accepted">
              <AcceptedTriplets />
            </TabsContent>
            <TabsContent value="rejected">
              <RejectedTriplets />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </Room>
  );
}
