import React, { useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useSkippedTriplets from "./real-time/hooks/useSkippedTriplets";
import { cn } from "@/lib/utils";
import { Undo2Icon } from "lucide-react";
import { toast } from "sonner";

const ClearSkippedTripletsModal: React.FC = () => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { skippedTripletIds, noSkippedTriplets, clearSkippedTriplets } =
    useSkippedTriplets();

  const onConfirm = () => {
    clearSkippedTriplets();
    toast.success("Cleared all skipped triplets");
    closeButtonRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={noSkippedTriplets ? "outline" : "destructive"}
          disabled={noSkippedTriplets}
          className={cn("fixed bottom-10 right-10 z-50", {
            "pointer-events-none": noSkippedTriplets,
          })}
        >
          <Undo2Icon className="mr-2" /> Clear ({skippedTripletIds.length})
          Skipped Triplets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Clear Skipped Triplets</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to clear all skipped triplets? This action
            cannot be undone.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild ref={closeButtonRef}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Clear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClearSkippedTripletsModal;
