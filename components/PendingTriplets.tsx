"use client";

import { updateTripletStatus } from "@/lib/actions/triplet.actions";
import { cn } from "@/lib/utils";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { ArrowDown, CheckCircle, Edit, XCircle } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { AddOrEditTripletDialog } from "./AddOrEditTripletDialog";
import { useRealtimeTriplets } from "./real-time/hooks/useRealtimeTriplets";
import SingleTripletCard from "./shared/SingleTripletCard";
import { Badge } from "./ui/badge";

export default function PendingTriplets() {
  const { triplets } = useRealtimeTriplets();

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
      toast.success("Triplet status updated successfully");
    }
  }, [updateState]);

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

  if (!currentTriplet) {
    return (
      <div className="flex justify-center items-center my-4">
        <Badge className="mx-auto scale-110">No Pending Triplets</Badge>
      </div>
    );
  }

  const isEditDisabled = isUpdateActionPending;

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
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          animate={controls}
          className="relative z-10"
        >
          <SingleTripletCard
            triplet={currentTriplet}
            isActionPending={isUpdateActionPending}
          />
        </motion.div>
        {/* Swipe direction icons */}
        <motion.div
          className="absolute z-30 top-1/2 right-0 transform translate-x-full -translate-y-1/2"
          animate={iconControls.right}
          initial={{ opacity: 0, scale: 1 }}
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>
        <motion.div
          className="absolute z-30 top-1/2 left-0 transform -translate-x-full -translate-y-1/2"
          animate={iconControls.left}
          initial={{ opacity: 0, scale: 1 }}
        >
          <XCircle className="w-12 h-12 text-red-500" />
        </motion.div>
        <motion.div
          className="absolute z-30 top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
          animate={iconControls.up}
          initial={{ opacity: 0, scale: 1 }}
        >
          <Edit className="w-12 h-12 text-blue-500" />
        </motion.div>
        <motion.div
          className="absolute z-30 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
          animate={iconControls.down}
          initial={{ opacity: 0, scale: 1 }}
        >
          <ArrowDown className="w-12 h-12 text-yellow-500" />
        </motion.div>
        <AddOrEditTripletDialog
          triplet={currentTriplet}
          openExternal={isEditModalOpen}
          setOpenExternal={setIsEditModalOpen}
        />
      </div>
    </>
  );
}
