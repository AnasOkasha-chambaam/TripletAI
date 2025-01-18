// /components/shared/SingleTripletCard.tsx

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  CircleIcon,
  EditIcon,
  InfoIcon,
  Loader2Icon,
  LockKeyholeIcon,
} from "lucide-react";
import React from "react";
import { LoaderOfTripletCard } from "../LoaderOfTripletCard";

interface TripletCardProps {
  triplet: TTriplet | null;
  isLoading?: boolean;
  lockedBy?: TLockedBy;
  isActionPending?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  statusToApply?: "accepted" | "rejected" | null;
}

const TestSingleTripletCard: React.FC<TripletCardProps> = ({
  triplet,
  isLoading = false,
  lockedBy,
  isActionPending = false,
  isSelected,
  onSelect,
  onEdit,
  statusToApply,
}) => {
  const tripletType = triplet?.status;

  //   const isDisabled = isActionPending;

  if (isLoading)
    return <CircleIcon className="animate-bounce text-yellow-400" />;
  return (
    <Card
      className={cn("max-w-md mx-auto w-80 md:w-full md:min-w-80", {
        "opacity-65": isActionPending || !!lockedBy || isLoading,
        "pointer-events-none": isLoading,
        "max-sm:w-60": !!lockedBy,
      })}
    >
      <div className="flex flex-row items-center justify-between">
        <CardHeader>
          <CardTitle
            className={cn("text-primary flex flex-row items-center", {
              "text-green-600": isActionPending && statusToApply === "accepted",
              "text-destructive":
                isActionPending && statusToApply === "rejected",
            })}
          >
            {isLoading || isActionPending ? (
              <>
                <Loader2Icon className="animate-spin mr-2" />{" "}
                {statusToApply === "accepted"
                  ? "Accepting Triplet"
                  : statusToApply === "rejected"
                  ? "Rejecting Triplet"
                  : "Loading"}
              </>
            ) : triplet === null ? (
              <>
                <InfoIcon className="mr-2" /> No Triplet Available
              </>
            ) : !!lockedBy ? (
              <>
                <LockKeyholeIcon className="mr-2" /> Locked
              </>
            ) : tripletType ? (
              tripletType.charAt(0).toUpperCase() +
              tripletType.slice(1) +
              " Triplet"
            ) : (
              ""
            )}
          </CardTitle>
          <CardDescription>
            {isLoading || isActionPending
              ? "Wait a second"
              : triplet === null
              ? "There are no triplets to display at the moment."
              : !!lockedBy
              ? `By: ${lockedBy.username}`
              : triplet?.status === "accepted"
              ? "Select to export"
              : triplet?.status === "rejected"
              ? "Edit and accept"
              : "Swipe to take an action"}
          </CardDescription>
        </CardHeader>
        {(onSelect || onEdit || lockedBy) && (
          <Separator orientation="vertical" className="h-14" />
        )}
        {onSelect && (
          <Checkbox
            id={triplet?._id}
            checked={isSelected}
            onCheckedChange={onSelect}
            className="mx-7 scale-150"
          />
        )}
        {onEdit && (
          <Button onClick={onEdit} className="mx-4">
            <EditIcon /> Edit
          </Button>
        )}
      </div>
      <Separator />
      <CardContent className="p-6 flex items-center justify-between">
        {isLoading ? (
          <div className="w-full">
            <LoaderOfTripletCard />
          </div>
        ) : triplet === null ? (
          <div className="w-full">
            <p className="text-muted-foreground text-center">
              You can request a locked triplet, or import new triplets
            </p>
          </div>
        ) : (
          <div className="w-full">
            <p
              className={cn("text-sm text-muted-foreground", {
                truncate: !!lockedBy,
              })}
            >
              {triplet?.instruction}
            </p>
            {triplet?.input && triplet?.input.length > 0 ? (
              <h3
                className={cn("mb-4 text-2xl font-bold", {
                  truncate: !!lockedBy,
                })}
              >
                {triplet?.input}
              </h3>
            ) : (
              <h3 className="mb-4 text-xl font-bold opacity-25">Empty</h3>
            )}
            <p
              className={cn("mb-4 p-2 pl-5 bg-muted border-l-4", {
                truncate: !!lockedBy,
              })}
            >
              {triplet?.output}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestSingleTripletCard;
