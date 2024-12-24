// /components/FileDropzone.tsx

"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileUpIcon, UploadCloud } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
}

export function FileDropzone({ onFileAccepted }: FileDropzoneProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        `border-2 border-dashed rounded-lg p-6 rotated-max-md-py-3 text-center cursor-pointer border-muted-foreground rotated-max-md-flex`,
        {
          "border-primary bg-primary/10": isDragActive,
        }
      )}
    >
      <input {...getInputProps()} name="file" />
      <UploadCloud
        className={cn(
          "mx-auto rotated-max-md-mx-2 size-12 rotated-max-md-size-5 text-muted-foreground",
          { "text-primary/10 rotated-max-md-hidden": !!fileName }
        )}
      />
      {fileName ? (
        <Badge
          className="mt-2 p-1 scale-125 rounded-sm opacity-60 rotated-max-md-mx-auto rotated-max-md-mt-0"
          variant={"outline"}
        >
          <FileUpIcon className="size-3 mr-1" /> {fileName}
        </Badge>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted-foreground rotated-max-md-hidden">
            Drag and drop a JSON or CSV file here, or click to select a file
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            (Only .json and .csv files will be accepted)
          </p>
        </>
      )}
    </div>
  );
}
