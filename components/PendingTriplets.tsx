"use client";

import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Triplet {
  _id: string;
  input: string;
  output: string;
  explanation: string;
}

export default function PendingTriplets() {
  const [triplets, setTriplets] = useState<Triplet[]>([]);
  const [currentTriplet, setCurrentTriplet] = useState<Triplet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchPendingTriplets();
  }, []);

  const fetchPendingTriplets = async () => {
    const response = await fetch("/api/triplets?status=pending");
    const data = await response.json();
    setTriplets(data);
    setCurrentTriplet(data[0] || null);
  };

  const updateTripletStatus = async (id: string, status: string) => {
    await fetch(`/api/triplets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setTriplets(triplets.filter((t) => t._id !== id));
    setCurrentTriplet(triplets[1] || null);
  };

  const handlers = useSwipeable({
    onSwipedRight: () =>
      currentTriplet && updateTripletStatus(currentTriplet._id, "accepted"),
    onSwipedLeft: () =>
      currentTriplet && updateTripletStatus(currentTriplet._id, "rejected"),
    onSwipedUp: () => setIsEditModalOpen(true),
    onSwipedDown: () => {
      if (currentTriplet) {
        const updatedTriplets = [
          ...triplets.filter((t) => t._id !== currentTriplet._id),
          currentTriplet,
        ];
        setTriplets(updatedTriplets);
        setCurrentTriplet(updatedTriplets[0] || null);
      }
    },
  });

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedTriplet = {
      input: formData.get("input") as string,
      output: formData.get("output") as string,
      explanation: formData.get("explanation") as string,
    };
    await fetch(`/api/triplets/${currentTriplet?._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTriplet),
    });
    setIsEditModalOpen(false);
    fetchPendingTriplets();
  };

  if (!currentTriplet) {
    return <div>No pending triplets</div>;
  }

  return (
    <div {...handlers}>
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <h3 className="font-bold mb-2">Input:</h3>
          <p className="mb-4">{currentTriplet.input}</p>
          <h3 className="font-bold mb-2">Output:</h3>
          <p className="mb-4">{currentTriplet.output}</p>
          <h3 className="font-bold mb-2">Explanation:</h3>
          <p>{currentTriplet.explanation}</p>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Triplet</DialogTitle>
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
                  defaultValue={currentTriplet.input}
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
                  defaultValue={currentTriplet.output}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="explanation" className="text-right">
                  Explanation
                </Label>
                <Input
                  id="explanation"
                  name="explanation"
                  defaultValue={currentTriplet.explanation}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
