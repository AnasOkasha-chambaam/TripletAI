"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  editTriplet,
  updateTripletStatus,
} from "@/lib/actions/triplet.actions";
import { cn } from "@/lib/utils";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { ArrowDown, CheckCircle, Edit, XCircle } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRealtimeTriplets } from "./real-time/hooks/useRealtimeTriplets";
import SingleTripletCard from "./shared/SingleTripletCard";
import { Badge } from "./ui/badge";

export default function PendingTriplets() {
  const { triplets, updateTriplet, removeTriplet } = useRealtimeTriplets();

  const pendingTriplets = triplets.filter((t) => t.status === "pending");
  const [currentTriplet, setCurrentTriplet] = useState<TTriplet | null>(null);
  const controls = useAnimation();
  const iconControls = {
    right: useAnimation(),
    left: useAnimation(),
    up: useAnimation(),
    down: useAnimation(),
  };

  const [updateState, updateAction, isUpdateActionPending] = useActionState(
    updateTripletStatus,
    null
  );
  const [editState, editAction, isEditActionPending] = useActionState(
    editTriplet,
    null
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (pendingTriplets.length > 0) {
      setCurrentTriplet(pendingTriplets[0]);
    } else {
      setCurrentTriplet(null);
    }
  }, [pendingTriplets]);

  useEffect(() => {
    if (updateState?.success) {
      removeTriplet(updateState.tripletId!);
      toast.success("Triplet status updated successfully");
    }
    if (editState?.success) {
      setIsEditModalOpen(false);
      updateTriplet(editState.triplet!);
      toast.success("Triplet edited successfully");
    }
  }, [updateState, editState, removeTriplet, updateTriplet]);

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
        removeTriplet(currentTriplet._id);
        updateTriplet({ ...currentTriplet, status: "pending" });
        return;
    }

    if (newStatus) {
      const formData = new FormData();
      formData.set("id", currentTriplet._id);
      formData.set("status", newStatus);
      startTransition(() => {
        controls.start({ x: 0, y: 0 });
        updateAction({
          tripletId: currentTriplet._id,
          newStatus,
        });
      });
    }
  };

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
    Object.values(iconControls).forEach((control) =>
      control.start({ scale: 1, opacity: 0 })
    );
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentTriplet) return;

    const formData = new FormData(event.currentTarget);
    formData.set("id", currentTriplet._id);
    startTransition(() => {
      editAction({
        tripletId: currentTriplet._id,
        instruction: formData.get("instruction") as string,
        input: formData.get("input") as string,
        output: formData.get("output") as string,
      });
    });
  };

  if (!currentTriplet) {
    return (
      <div className="flex justify-center items-center my-4">
        <Badge className="mx-auto scale-110">No Pending Triplets</Badge>
      </div>
    );
  }

  const isEditDisabled = isEditActionPending || isUpdateActionPending;

  return (
    <>
      <div className="flex justify-center items-center my-4">
        <Badge className="mx-auto scale-110">
          <span className="underline mr-1">{pendingTriplets.length}</span>{" "}
          Pending Triplets
        </Badge>
      </div>

      <div
        className={cn(
          "relative flex flex-col justify-center items-center gap-3",
          {
            "pointer-events-none": isEditDisabled,
          }
        )}
      >
        <motion.div
          // {...handlers}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          animate={controls}
          className="relative z-10"
        >
          <SingleTripletCard
            triplet={currentTriplet}
            isActionPending={isUpdateActionPending || isEditActionPending}
          />
          {/* <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">Instruction:</h3>
            <p className="mb-4">{currentTriplet.instruction}</p>
            <h3 className="font-bold mb-2">Input:</h3>
            <p className="mb-4">{currentTriplet.input}</p>
            <h3 className="font-bold mb-2">Output:</h3>
            <p>{currentTriplet.output}</p>
          </CardContent>
        </Card> */}
        </motion.div>
        {/* Swipe direction icons */}
        <motion.div
          className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2"
          animate={iconControls.right}
          initial={{ opacity: 0, scale: 1 }}
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2"
          animate={iconControls.left}
          initial={{ opacity: 0, scale: 1 }}
        >
          <XCircle className="w-12 h-12 text-red-500" />
        </motion.div>
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
          animate={iconControls.up}
          initial={{ opacity: 0, scale: 1 }}
        >
          <Edit className="w-12 h-12 text-blue-500" />
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
          animate={iconControls.down}
          initial={{ opacity: 0, scale: 1 }}
        >
          <ArrowDown className="w-12 h-12 text-yellow-500" />
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
    </>
  );
}
