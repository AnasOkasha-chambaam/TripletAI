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
import { motion, PanInfo, useAnimation } from "framer-motion";
import { ArrowDown, CheckCircle, Edit, XCircle } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { toast } from "sonner";
import SingleTripletCard from "./shared/SingleTripletCard";
import EmptyStateCard from "./EmptyStateCard";

export default function PendingTriplets() {
  const [triplets, setTriplets] = useState<TTriplet[]>([]);
  const [currentTriplet, setCurrentTriplet] = useState<TTriplet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const controls = useAnimation();
  const iconControls = {
    right: useAnimation(),
    left: useAnimation(),
    up: useAnimation(),
    down: useAnimation(),
  };

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
      const formData = new FormData();
      formData.append("id", currentTriplet._id);
      formData.append("status", newStatus);

      startTransition(() => updateAction(formData));
    }
  };

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      const { deltaX, deltaY } = eventData;
      controls.start({ x: deltaX, y: deltaY });

      // Animate icons based on swipe direction
      const threshold = 50;
      iconControls.right.start({
        scale: deltaX > threshold ? 1.5 : 1,
        opacity: 1,
      });
      iconControls.left.start({
        scale: deltaX < -threshold ? 1.5 : 1,
        opacity: 1,
      });
      iconControls.up.start({
        scale: deltaY < -threshold ? 1.5 : 1,
        opacity: 1,
      });
      iconControls.down.start({
        scale: deltaY > threshold ? 1.5 : 1,
        opacity: 1,
      });
    },
    onSwiped: () =>
      // eventData
      {
        // handleSwipe(eventData.dir.toLowerCase());
        controls.start({ x: 0, y: 0 });
        Object.values(iconControls).forEach((control) =>
          control.start({ scale: 1, opacity: 0 })
        );
      },
    // preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 50; // minimum distance required to trigger a swipe
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
    formData.append("id", currentTriplet._id);

    startTransition(() => editAction(formData));
  };

  if (!currentTriplet || triplets.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <EmptyStateCard importSuccessCallback={fetchPendingTriplets} />
      </div>
    );
  }

  return (
    <div {...handlers}>
      <div className="relative md:p-20 w-fit mx-auto">
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          animate={controls}
          className="relative z-10"
        >
          <SingleTripletCard triplet={currentTriplet} />
        </motion.div>

        {/* Swipe direction icons */}
        <motion.div
          className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 z-10"
          animate={iconControls.right}
          initial={{ opacity: 0, scale: 1 }}
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 z-10"
          animate={iconControls.left}
          initial={{ opacity: 0, scale: 1 }}
        >
          <XCircle className="w-12 h-12 text-red-500" />
        </motion.div>
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full z-10"
          animate={iconControls.up}
          initial={{ opacity: 0, scale: 1 }}
        >
          <Edit className="w-12 h-12 text-blue-500" />
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full z-10"
          animate={iconControls.down}
          initial={{ opacity: 0, scale: 1 }}
        >
          <ArrowDown className="w-12 h-12 text-yellow-500" />
        </motion.div>
      </div>

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
