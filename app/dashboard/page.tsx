import AcceptedTriplets from "@/components/AcceptedTriplets";
import { AddOrEditTripletDialog } from "@/components/AddOrEditTripletDialog";
import { ImportTripletsDialog } from "@/components/ImportTripletsDialog";
import PendingTriplets from "@/components/PendingTriplets";
import RejectedTriplets from "@/components/RejectedTriplets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { syncTripletsWithLiveblocks } from "@/lib/actions/triplet.actions";
import { CircleCheckIcon, CircleDotIcon, CircleXIcon } from "lucide-react";
import { Room } from "./Room";

export default async function Dashboard() {
  await syncTripletsWithLiveblocks();

  return (
    <Room initialTriplets={[]}>
      <div className="min-h-screen overflow-x-hidden">
        <section className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground/80">
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
