"use client";
import React from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

const CopyAsJSONButton = ({ perfumeData }: { perfumeData: unknown }) => {
  const copyAsJson = () => {
    const jsonData = JSON.stringify(perfumeData, null, 2);
    navigator.clipboard.writeText(jsonData).then(() => {
      toast.success("Perfume data copied to clipboard");
    });
  };
  return (
    <Button onClick={copyAsJson} className="active:scale-90">
      <CopyIcon className="mr-2" />
      Copy as JSON
    </Button>
  );
};

export { CopyAsJSONButton };
