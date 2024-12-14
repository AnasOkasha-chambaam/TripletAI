import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingTriplets from "@/components/PendingTriplets";
import AcceptedTriplets from "@/components/AcceptedTriplets";
import RejectedTriplets from "@/components/RejectedTriplets";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">
          Supervised Learning Triplets Dashboard
        </h1>
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
      </main>
    </div>
  );
}
