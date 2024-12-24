"use client";

import { updateTripletStatus } from "@/lib/actions/triplet.actions";
import { cn } from "@/lib/utils";
import { shallow, useUpdateMyPresence } from "@liveblocks/react";
import { useOthersMapped } from "@liveblocks/react/suspense";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { CheckCircle, Edit, InfoIcon, XCircle } from "lucide-react";
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
        <Badge className="mx-auto scale-110 p-3 rounded-md" variant={"outline"}>
          <InfoIcon className="mr-2 size-4" /> No Pending Triplets
        </Badge>
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
              <div className="relative group cursor-grab active:cursor-grabbing">
                <motion.div
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  onDragEnd={handleDragEnd}
                  animate={controls}
                  className="relative z-30 group"
                >
                  <SingleTripletCard
                    triplet={currentTriplet}
                    isActionPending={isUpdateActionPending}
                  />
                </motion.div>

                {/* Swipe direction icons */}
                <div className="absolute z-40 md:z-20 size-20 font-bold bg-green-700  border-muted border-4 outline-green-700 outline flex flex-col justify-center items-center gap-2 text-muted text-sm rounded-[50%] top-1/2 -right-4 transform md:translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-75 pointer-events-none transition-opacity ">
                  <CheckCircle className="size-5" /> Accept
                </div>
                <div className="absolute z-40 md:z-20 size-20 font-bold bg-red-700 border-muted border-4 outline-red-700 outline flex flex-col justify-center items-center gap-2 text-muted text-sm rounded-[50%] top-1/2 -left-4 transform md:-translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-75 pointer-events-none transition-opacity">
                  <XCircle className="size-5" /> Reject
                </div>
                <div className="absolute z-40 md:z-20 size-20 font-bold bg-blue-700 border-muted border-4 outline-blue-700 outline flex flex-col justify-center items-center gap-2 text-muted text-sm rounded-[50%] -top-4 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-75 pointer-events-none transition-opacity">
                  <Edit className="size-5" /> Edit
                </div>
                {/* TODO: Implement `Skip` functionality */}
                {/* <div className="absolute z-40 md:z-20 size-20 font-bold bg-yellow-700 border-muted border-4 outline-yellow-700 outline flex flex-col justify-center items-center gap-2 text-muted text-sm rounded-[50%] -bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-75 pointer-events-none transition-opacity">
                  <ArrowDown className="size-5" /> Skip
                </div> */}
              </div>
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
