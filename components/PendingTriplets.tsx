"use client";

import { updateTripletStatus } from "@/lib/actions/triplet.actions";
import { cn } from "@/lib/utils";
import { motion, PanInfo, useAnimation } from "framer-motion";
import {
  ArrowDown,
  CheckCircle,
  Edit,
  InfoIcon,
  Loader2,
  XCircle,
} from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { AddOrEditTripletDialog } from "./AddOrEditTripletDialog";
import ClearSkippedTripletsModal from "./ClearSkippedTripletsModal";
import EmblaCarouselClassNames from "./EmblaCarouselClassNames";
import useAnsweredRequests from "./real-time/hooks/useAnsweredRequests";
import useFetchAndLockNextTriplet from "./real-time/hooks/useFetchAndLockNextTriplet";
import usePendingTriplets from "./real-time/hooks/usePendingTriplets";
import { useReleaseTriplet } from "./real-time/hooks/useReleaseTriplet";
import useSkippedTriplets from "./real-time/hooks/useSkippedTriplets";
import SingleTripletCard from "./shared/SingleTripletCard";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

export default function PendingTriplets() {
  const {
    pendingTripletsCount,
    currentTriplet,
    unlockTriplet,
    lockedTripletsByOthers,
  } = usePendingTriplets();

  const {} = useAnsweredRequests();

  const {} = useReleaseTriplet();

  const { skipTriplet } = useSkippedTriplets();

  const { isGetNextTripletActionPending, isGetTripletsCountActionPending } =
    useFetchAndLockNextTriplet();

  const [statusToApply, setStatusToApply] = useState<
    "accepted" | "rejected" | null
  >(null);

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
    if (updateState?.success) {
      if (statusToApply === "accepted") {
        toast.success("Triplet accepted successfully");
      }
      if (statusToApply === "rejected") {
        toast.info("Triplet was rejected", {
          richColors: false,
        });
      }
      if (currentTriplet) {
        unlockTriplet(
          currentTriplet._id,
          statusToApply === "accepted" ? "accept" : "reject"
        );
      }

      setStatusToApply(null);
    }
  }, [updateState]);

  const handleSwipe = async (direction: string) => {
    if (!currentTriplet) return;

    let newStatus = "";
    switch (direction) {
      case "right":
        setStatusToApply("accepted");
        newStatus = "accepted";
        break;
      case "left":
        setStatusToApply("rejected");
        newStatus = "rejected";
        break;
      case "up":
        setIsEditModalOpen(true);
        return;
      case "down":
        // Move to bottom of the list
        skipTriplet(currentTriplet._id);

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

  if (pendingTripletsCount === 0) {
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
        {lockedTripletsByOthers.length > 0 ? (
          <EmblaCarouselClassNames slides={lockedTripletsByOthers} />
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
              {isGetNextTripletActionPending ||
              isGetTripletsCountActionPending ? (
                <Loader2 className="animate-spin mr-2 size-3" />
              ) : (
                <span className="underline mr-1">{pendingTripletsCount}</span>
              )}{" "}
              Pending Triplets
            </Badge>
          </div>
          {currentTriplet || true ? (
            <div
              className={cn(
                "relative flex flex-row justify-center items-center gap-3",
                {
                  "pointer-events-none":
                    isEditDisabled ||
                    isGetNextTripletActionPending ||
                    !currentTriplet,
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
                    isLoading={isGetNextTripletActionPending}
                    triplet={currentTriplet || null}
                    isActionPending={isEditDisabled}
                    statusToApply={statusToApply}
                  />
                </motion.div>

                {/* Swipe direction icons */}
                <div className="absolute z-40 md:z-20 size-20 font-bold bg-green-700  border-muted border-4 outline-green-700 outline flex flex-col justify-center items-center gap-2 text-muted text-sm rounded-[50%] top-1/2 -right-4 transform md:translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-75 group-active:opacity-90 pointer-events-none transition-opacity ">
                  <CheckCircle className="size-5" /> Accept
                </div>
                <div className="absolute z-40 md:z-20 size-20 font-bold bg-red-700 border-muted border-4 outline-red-700 outline flex flex-col justify-center items-center gap-2 text-muted text-sm rounded-[50%] top-1/2 -left-4 transform md:-translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-75 group-active:opacity-90 pointer-events-none transition-opacity">
                  <XCircle className="size-5" /> Reject
                </div>
                <div className="absolute z-40 md:z-20 size-20 font-bold bg-blue-700 border-muted border-4 outline-blue-700 outline flex flex-col justify-center items-center gap-2 text-muted text-sm rounded-[50%] -top-4 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-75 group-active:opacity-90 pointer-events-none transition-opacity">
                  <Edit className="size-5" /> Edit
                </div>
                <div className="absolute z-40 md:z-20 size-20 font-bold bg-yellow-700 border-muted border-4 outline-yellow-700 outline flex flex-col justify-center items-center gap-2 text-muted text-sm rounded-[50%] -bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-75 group-active:opacity-90 pointer-events-none transition-opacity">
                  <ArrowDown className="size-5" /> Skip
                </div>
              </div>
              {currentTriplet && (
                <AddOrEditTripletDialog
                  triplet={currentTriplet}
                  openExternal={isEditModalOpen}
                  setOpenExternal={setIsEditModalOpen}
                  successCallback={() => {
                    toast.success(
                      "Triplet edited and added to the accepted list"
                    );
                    unlockTriplet(currentTriplet._id, "edit");
                  }}
                />
              )}
            </div>
          ) : (
            // isGetNextTripletActionPending ? (
            //   <div className="flex justify-center items-center my-4">
            //     <Badge
            //       className="mx-auto scale-110 p-3 rounded-md"
            //       variant={"secondary"}
            //     >
            //       <CircleIcon className="animate-bounce mr-2 size-4 text-yellow-600" />{" "}
            //       Fetching Next Triplet
            //     </Badge>
            //   </div>
            // ) :
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
      <ClearSkippedTripletsModal />
    </>
  );
}
