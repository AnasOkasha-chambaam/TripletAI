// /components/RejectedTriplets.tsx

"use client";

import SingleTripletCard from "@/components/shared/SingleTripletCard";
import { useEffect, useState } from "react";
import { AddOrEditTripletDialog } from "./AddOrEditTripletDialog";

export default function RejectedTriplets() {
  const [triplets, setTriplets] = useState<TTriplet[]>([]);
  const [editingTriplet, setEditingTriplet] = useState<TTriplet | null>(null);

  useEffect(() => {
    fetchRejectedTriplets();
  }, []);

  const fetchRejectedTriplets = async () => {
    const response = await fetch("/api/triplets?status=rejected");
    const data = await response.json();
    setTriplets(data);
  };

  const handleEditAndAccept = (triplet: TTriplet) => {
    setEditingTriplet(triplet);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {triplets.map((triplet) => (
          <SingleTripletCard
            key={triplet._id}
            triplet={triplet}
            onEdit={() => handleEditAndAccept(triplet)}
          />
        ))}
      </div>
      {editingTriplet && (
        <AddOrEditTripletDialog
          openExternal={!!editingTriplet}
          setOpenExternal={() => setEditingTriplet(null)}
          triplet={editingTriplet}
        />
      )}
    </div>
  );
}
