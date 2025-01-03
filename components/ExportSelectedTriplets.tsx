import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { XCircleIcon, BracesIcon, SheetIcon, FileUpIcon } from "lucide-react";

interface ShowSelectedTripletsModalProps {
  selectedTriplets: Map<string, TTriplet>;
  onDeselect: (triplet: TTriplet) => void;
  onExportSelected: (format: "json" | "csv") => void;
  isExporting: boolean;
}

export function ShowSelectedTripletsModal({
  selectedTriplets,
  onDeselect,
  onExportSelected,
  isExporting,
}: ShowSelectedTripletsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={selectedTriplets.size === 0 ? "outline" : "default"}
          disabled={selectedTriplets.size === 0}
          className="fixed bottom-10 right-10 z-50"
        >
          <FileUpIcon className="mr-2" /> Export ({selectedTriplets.size})
          Selected Triplets
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Selected Triplets</DialogTitle>
          <DialogDescription>
            You have selected {selectedTriplets.size} triplets
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mb-4">
          <Button
            onClick={() => onExportSelected("json")}
            variant="outline"
            disabled={isExporting}
          >
            <BracesIcon className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
          <Button
            onClick={() => onExportSelected("csv")}
            variant="outline"
            disabled={isExporting}
          >
            <SheetIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
        <ScrollArea className="relative flex-grow h-[50vh] p-2 bg-card">
          <div className="space-y-2 p-4 pb-14">
            {Array.from(selectedTriplets.values()).map((triplet) => (
              <div
                key={triplet._id}
                className="flex justify-between items-start bg-secondary p-2 rounded"
              >
                <div className="flex-grow mr-4">
                  <p className="text-sm truncate">
                    Instruction: {triplet.instruction}
                  </p>
                  <p className="text-sm font-semibold mb-1 truncate">
                    Input: {triplet.input}
                  </p>
                  <p className="text-sm mb-1 truncate">
                    Output: {triplet.output}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeselect(triplet)}
                >
                  <XCircleIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-card to-transparent" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
