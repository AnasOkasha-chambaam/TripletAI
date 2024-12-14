"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
        <Card key={triplet._id} className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-bold">Input: {triplet.input}</h3>
            <p>Output: {triplet.output}</p>
            <p>Instruction: {triplet.instruction}</p>
            <Button
              onClick={() => handleEditAndAccept(triplet)}
              className="mt-2"
            >
              Edit and Accept
            </Button>
          </CardContent>
        </Card>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="input" className="text-right">
                  Input
                </Label>
                <Input
                  id="input"
                  name="input"
                  defaultValue={editingTriplet?.input}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="output" className="text-right">
                  Output
                </Label>
                <Input
                  id="output"
                  name="output"
                  defaultValue={editingTriplet?.output}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="instruction" className="text-right">
                  Instruction
                </Label>
                <Input
                  id="instruction"
                  name="instruction"
                  defaultValue={editingTriplet?.instruction}
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
