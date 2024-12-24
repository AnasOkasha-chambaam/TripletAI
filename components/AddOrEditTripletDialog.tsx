// /components/AddOrEditTripletDialog.tsx

"use client";

import React, { useState, useEffect, useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addTriplet, editTriplet } from "@/lib/actions/triplet.actions";
import { toast } from "sonner";
import { PlusIcon, EditIcon } from "lucide-react";

export function AddOrEditTripletDialog({
  triplet,
  openExternal = false,
  setOpenExternal,
}: {
  triplet?: TTriplet;
  openExternal?: boolean;
  setOpenExternal?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
  const [addTripletState, addTripletAction, isAddTripletPending] =
    useActionState(addTriplet, null);

  const [editTripletState, editTripletAction, isEditTripletPending] =
    useActionState(editTriplet, null);

  useEffect(() => {
    if (addTripletState) {
      if (addTripletState.success) {
        setOpen(false);
        setOpenExternal?.(false);

        toast.success(`Triplet added successfully`, {
          description: `The triplet has been added successfully.`,
        });
      } else {
        toast.error(`Error adding triplet`, {
          description:
            addTripletState.error ||
            `There was an error adding the triplet. Please try again.`,
        });
      }
    }
  }, [addTripletState, setOpenExternal]);

  useEffect(() => {
    if (editTripletState) {
      if (editTripletState.success) {
        setOpen(false);
        setOpenExternal?.(false);

        toast.success(`Triplet edited successfully`, {
          description: `The triplet has been edited successfully.`,
        });
      } else {
        toast.error(`Error editing triplet`, {
          description:
            editTripletState.error ||
            `There was an error editing the triplet. Please try again.`,
        });
      }
    }
  }, [editTripletState, setOpenExternal]);

  const isPending = triplet ? isEditTripletPending : isAddTripletPending;

  return (
    <Dialog
      open={openExternal || open}
      onOpenChange={setOpenExternal ? setOpenExternal : setOpen}
    >
      {!setOpenExternal && (
        <DialogTrigger asChild>
          <Button className="group">
            {triplet ? (
              <>
                <EditIcon className="sm:mr-2x" />
                <span className="hidden sm:inline group-hover:inline">
                  Edit Triplet
                </span>
              </>
            ) : (
              <>
                <PlusIcon className="sm:mr-2x" />
                <span className="hidden sm:inline group-hover:inline">
                  Add New Triplet
                </span>
              </>
            )}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {triplet ? "Edit Triplet" : "Add New Triplet"}
          </DialogTitle>
          <DialogDescription>
            {triplet
              ? "Edit the triplet details below."
              : "Add a new triplet to the accepted list. Fill out all fields below."}
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) => {
            const instruction = formData.get("instruction") as string;
            const input = formData.get("input") as string;
            const output = formData.get("output") as string;
            if (triplet) {
              editTripletAction({
                tripletId: triplet._id,
                instruction,
                input,
                output,
              });
            } else {
              addTripletAction({ instruction, input, output });
            }
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="instruction">Instruction</Label>
              <Input
                id="instruction"
                name="instruction"
                defaultValue={triplet?.instruction}
                className="col-span-3"
                required
                disabled={isPending}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="input">Input</Label>
              <Input
                id="input"
                name="input"
                defaultValue={triplet?.input}
                className="col-span-3"
                required
                disabled={isPending}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="output">Output</Label>
              <Textarea
                id="output"
                name="output"
                defaultValue={triplet?.output}
                className="col-span-3"
                required
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? triplet
                  ? "Saving..."
                  : "Adding..."
                : triplet
                ? "Save & Accept"
                : "Add Triplet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
