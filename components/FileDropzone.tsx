// /components/FileDropzone.tsx

"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileUpIcon, UploadCloud } from "lucide-react";
import { Badge } from "./ui/badge";

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
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
        isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} name="file" />
      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
      {fileName ? (
        <Badge
          className="mt-2 p-1 scale-125 rounded-sm opacity-60"
          variant={"outline"}
        >
          <FileUpIcon className="size-3 mr-1" /> {fileName}
        </Badge>
      ) : (
        <>
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop a JSON or CSV file here, or click to select a file
          </p>
          <p className="mt-1 text-xs text-gray-500">
            (Only .json and .csv files will be accepted)
          </p>
        </>
      )}
    </div>
  );
}
