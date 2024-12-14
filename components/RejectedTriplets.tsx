"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SingleTripletCard from "@/components/shared/SingleTripletCard";
import { Textarea } from "./ui/textarea";

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
      {triplets.map((triplet) => (
        <SingleTripletCard
          key={triplet._id}
          triplet={triplet}
          onEdit={() => handleEditAndAccept(triplet)}
        />
      ))}

      <Dialog
        open={!!editingTriplet}
        onOpenChange={() => setEditingTriplet(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit and Accept Triplet</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="instruction">Instruction</Label>
                <Input
                  id="instruction"
                  name="instruction"
                  defaultValue={editingTriplet?.instruction}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="input">Input</Label>
                <Input
                  id="input"
                  name="input"
                  defaultValue={editingTriplet?.input}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="output">Output</Label>
                <Textarea
                  id="output"
                  name="output"
                  defaultValue={editingTriplet?.output}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save and Accept</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
