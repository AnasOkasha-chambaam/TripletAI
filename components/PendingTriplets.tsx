"use client";

import { updateTripletStatus } from "@/lib/actions/triplet.actions";
import { cn } from "@/lib/utils";
import { shallow, useUpdateMyPresence } from "@liveblocks/react";
import { useOthersMapped } from "@liveblocks/react/suspense";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { ArrowDown, CheckCircle, Edit, InfoIcon, XCircle } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { AddOrEditTripletDialog } from "./AddOrEditTripletDialog";
import EmblaCarouselClassNames from "./EmblaCarouselClassNames";
import { useRealtimeTriplets } from "./real-time/hooks/useRealtimeTriplets";
import SingleTripletCard from "./shared/SingleTripletCard";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

export default function PendingTriplets() {
  const { triplets } = useRealtimeTriplets();

  const [currentTriplet, setCurrentTriplet] = useState<TTriplet | null>(null);

  const updateMyPresence = useUpdateMyPresence();

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

  const lockedTripletsMapped = useOthersMapped(
    (other) => ({
      triplet: other.presence.lockedTriplet,
      lockedBy: other.presence.user,
    }),
    shallow
  );

  const lockedTriplets = Array.from(lockedTripletsMapped)
    .filter((lt) => lt[1].triplet)
    .map((lt) => lt[1]) as TLockedTriplet[];

  const pendingTriplets = triplets.filter((t) => t.status === "pending");

  const availableTriplets = pendingTriplets.filter(
    (t) => !lockedTriplets.find((lt) => lt.triplet._id === t._id)
  );

  useEffect(() => {
    updateMyPresence({
      lockedTriplet: currentTriplet,
    });
  }, [currentTriplet]);

  useEffect(() => {
    if (availableTriplets.length > 0) {
      setCurrentTriplet(availableTriplets[0]);
    } else {
      setCurrentTriplet(null);
    }
  }, [availableTriplets]);

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

  if (pendingTriplets?.length === 0) {
    return (
      <div className="flex justify-center items-center my-4">
        <Badge className="mx-auto scale-110">No Pending Triplets</Badge>
      </div>
    );
  }

  const isEditDisabled = isUpdateActionPending;

  return (
    <>
      <div className="relative flex flex-row max-md:flex-col-reverse justify-center items-center gap-3">
        {lockedTriplets.length > 0 ? (
          <EmblaCarouselClassNames slides={lockedTriplets} />
        ) : (
          <div className="flex justify-center items-center my-4 min-w-60">
            <Badge
              className="mx-auto scale-110 p-3 rounded-md"
              variant={"secondary"}
            >
              <InfoIcon className="mr-2 size-4" /> No Locked Triplets
            </Badge>
          </div>
        )}
        <Separator className="h-96 max-md:hidden" orientation="vertical" />
        <Separator className="w-96 md:hidden" orientation="horizontal" />
        <div className=" w-full">
          <div className="flex justify-center items-center my-6">
            <Badge className="mx-auto scale-110">
              <span className="underline mr-1">{pendingTriplets.length}</span>{" "}
              Pending Triplets
            </Badge>
          </div>
          {currentTriplet ? (
            <div
              className={cn(
                "relative flex flex-row justify-center items-center gap-3",
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
                className="relative z-10 group"
              >
                <SingleTripletCard
                  triplet={currentTriplet}
                  isActionPending={isUpdateActionPending}
                />
                {/* Swipe direction icons */}
                <motion.div
                  className="absolute z-30 top-1/2 right-0 transform translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={iconControls.right}
                  initial={{ opacity: 0, scale: 1 }}
                >
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>
                <motion.div
                  className="absolute z-30 top-1/2 left-0 transform -translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={iconControls.left}
                  initial={{ opacity: 0, scale: 1 }}
                >
                  <XCircle className="w-12 h-12 text-red-500" />
                </motion.div>
                <motion.div
                  className="absolute z-30 top-0 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={iconControls.up}
                  initial={{ opacity: 0, scale: 1 }}
                >
                  <Edit className="w-12 h-12 text-blue-500" />
                </motion.div>
                <motion.div
                  className="absolute z-30 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={iconControls.down}
                  initial={{ opacity: 0, scale: 1 }}
                >
                  <ArrowDown className="w-12 h-12 text-yellow-500" />
                </motion.div>
              </motion.div>
              <AddOrEditTripletDialog
                triplet={currentTriplet}
                openExternal={isEditModalOpen}
                setOpenExternal={setIsEditModalOpen}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center my-4">
              <Badge
                className="mx-auto scale-110 p-3 rounded-md"
                variant={"secondary"}
              >
                <InfoIcon className="mr-2 size-4" /> No Available Triplets
              </Badge>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
