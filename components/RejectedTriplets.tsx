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

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedTriplet = {
      input: formData.get("input") as string,
      output: formData.get("output") as string,
      instruction: formData.get("instruction") as string,
      status: "accepted",
    };
    await fetch(`/api/triplets/${editingTriplet?._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTriplet),
    });
    setEditingTriplet(null);
    fetchRejectedTriplets();
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
