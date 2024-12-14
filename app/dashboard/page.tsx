import AcceptedTriplets from "@/components/AcceptedTriplets";
import { AddTripletDialog } from "@/components/AddTripletDialog";
import { ImportTripletsDialog } from "@/components/ImportTripletsDialog";
import PendingTriplets from "@/components/PendingTriplets";
import RejectedTriplets from "@/components/RejectedTriplets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground/80">
            Triplets
          </h2>
          <div className="space-x-4">
            <ImportTripletsDialog />
            <AddTripletDialog />
          </div>
        </div>
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
  );
}
