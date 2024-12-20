// /components/ImportTripletsDialog.tsx

"use client";

import { startTransition, useEffect, useState } from "react";
import { useActionState } from "react";
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
import { FileDropzone } from "./FileDropzone";
import { importTriplets } from "@/lib/actions/triplet.actions";
import { toast } from "sonner";
import { UploadIcon } from "lucide-react";

export function ImportTripletsDialog({
  successCallback,
}: {
  successCallback?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [state, importTripletsAction, isPending] = useActionState(
    importTriplets,
    null
  );

  const handleFileAccepted = (acceptedFile: File) => {
    setFile(acceptedFile);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    startTransition(() => importTripletsAction(formData));
  };

  useEffect(() => {
    if (state) {
      if (state.success) {
        setOpen(false);
        toast.success("Triplets imported successfully", {
          description: `${state.count} triplets have been imported as pending.`,
        });
        successCallback?.();
      } else {
        toast.error("Error importing triplets", {
          description:
            state.error ||
            "There was an error importing the triplets. Please try again.",
        });
      }
    }
  }, [state, successCallback]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UploadIcon className="mr-2 h-4 w-4" />
          Import Triplets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Triplets</DialogTitle>
          <DialogDescription>
            Import triplets from a JSON or CSV file. Imported triplets will be
            set to pending status.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <FileDropzone onFileAccepted={handleFileAccepted} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!file || isPending}>
              {isPending ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
