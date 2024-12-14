"use client";

import { useState, useEffect, useActionState } from "react";

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
import { addTriplet } from "@/lib/actions/triplet.actions";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

export function AddTripletDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(addTriplet, null);

  useEffect(() => {
    if (state) {
      if (state.success) {
        setOpen(false);

        toast.success("Triplet added successfully", {
          description: "The new triplet has been added as an accepted triplet.",
        });
      } else {
        toast.error("Error adding triplet", {
          description:
            "There was an error adding the triplet. Please try again.",
        });
      }
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2x" />
          Add New Triplet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Triplet</DialogTitle>
          <DialogDescription>
            Add a new triplet to the accepted list. Fill out all fields below.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="instruction">Instruction</Label>
              <Input
                id="instruction"
                name="instruction"
                className="col-span-3"
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="input">Input</Label>
              <Input id="input" name="input" className="col-span-3" required />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="output">Output</Label>
              <Textarea
                id="output"
                name="output"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Triplet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
