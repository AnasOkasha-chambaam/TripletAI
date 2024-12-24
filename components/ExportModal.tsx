import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BracesIcon, FileOutputIcon, SheetIcon } from "lucide-react";

interface ExportModalProps {
  onExport: (format: string) => void;
  disabled?: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({
  onExport,
  disabled = false,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="sm:hidden" variant={"outline"} disabled={disabled}>
          <FileOutputIcon className="mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Export Format</DialogTitle>
          <DialogDescription>
            Choose the format in which you want to export the selected triplets.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <Button variant={"outline"} onClick={() => onExport("json")}>
            <BracesIcon className="mr-2" />
            Export as JSON
          </Button>
          <Button variant={"outline"} onClick={() => onExport("csv")}>
            <SheetIcon className="mr-2" />
            Export as CSV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
