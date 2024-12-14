"use client";

import { useState, useEffect, useActionState, startTransition } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, useAnimation, PanInfo } from "framer-motion";
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
import {
  updateTripletStatus,
  editTriplet,
} from "@/lib/actions/triplet.actions";
import { CheckCircle, XCircle, Edit, ArrowDown } from "lucide-react";
import { toast } from "sonner";

export default function PendingTriplets() {
  const [triplets, setTriplets] = useState<TTriplet[]>([]);
  const [currentTriplet, setCurrentTriplet] = useState<TTriplet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const controls = useAnimation();

  const [updateState, updateAction] = useActionState(updateTripletStatus, null);

  const [editState, editAction] = useActionState(editTriplet, null);

  useEffect(() => {
    fetchPendingTriplets();
  }, []);

  useEffect(() => {
    if (updateState?.success) {
      setTriplets((prev) =>
        prev.filter((t) => t._id !== updateState.tripletId)
      );
      setCurrentTriplet(triplets[1] || null);
      toast.success("Triplet status updated successfully");
    }
    if (editState?.success) {
      setIsEditModalOpen(false);
      fetchPendingTriplets();
      toast.success("Triplet edited successfully");
    }
  }, [updateState, editState]);

  const fetchPendingTriplets = async () => {
    const response = await fetch("/api/triplets?status=pending");
    const data = await response.json();
    setTriplets(data);
    setCurrentTriplet(data[0] || null);
  };

  const handleSwipe = async (direction: string) => {
    if (!currentTriplet) return;

    let newStatus = "";
    switch (direction) {
      case "right":
        newStatus = "accepted";
        break;
      case "left":
        newStatus = "rejected";
        break;
      case "up":
        setIsEditModalOpen(true);
        return;
      case "down":
        // Move to bottom of the list
        setTriplets((prev) => [
          ...prev.filter((t) => t._id !== currentTriplet._id),
          currentTriplet,
        ]);
        setCurrentTriplet(triplets[1] || null);
        return;
    }

    if (newStatus) {
      startTransition(() =>
        updateAction({ tripletId: currentTriplet._id, newStatus })
      );
    }
  };

  const handlers = useSwipeable({
    onSwiped: (eventData) => handleSwipe(eventData.dir.toLowerCase()),
    // preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100; // minimum distance required to trigger a swipe
    if (Math.abs(info.offset.x) > threshold) {
      handleSwipe(info.offset.x > 0 ? "right" : "left");
    } else if (Math.abs(info.offset.y) > threshold) {
      handleSwipe(info.offset.y > 0 ? "down" : "up");
    } else {
      controls.start({ x: 0, y: 0 });
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentTriplet) return;

    const formData = new FormData(event.currentTarget);

    startTransition(() => editAction(formData));
  };

  if (!currentTriplet) {
    return <div>No pending triplets</div>;
  }

  return (
    <div {...handlers}>
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">Instruction:</h3>
            <p className="mb-4">{currentTriplet.instruction}</p>
            <h3 className="font-bold mb-2">Input:</h3>
            <p className="mb-4">{currentTriplet.input}</p>
            <h3 className="font-bold mb-2">Output:</h3>
            <p>{currentTriplet.output}</p>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Triplet</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="instruction" className="text-right">
                  Instruction
                </Label>
                <Input
                  id="instruction"
                  name="instruction"
                  defaultValue={currentTriplet.instruction}
                  className="col-span-3"
                />
              </div>
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
