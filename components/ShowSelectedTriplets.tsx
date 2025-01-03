import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ScanIcon, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ShowSelectedTripletsModalProps {
  selectedTriplets: Set<string>;
  onDeselect: (id: string) => void;
}

export function ShowSelectedTripletsModal({
  selectedTriplets,
  onDeselect,
}: ShowSelectedTripletsModalProps) {
  const [showSelectedTriplets, setShowSelectedTriplets] = useState(false);
  useEffect(() => {
    if (selectedTriplets.size === 0) setShowSelectedTriplets(false);
  }, [selectedTriplets]);
  return (
    <Dialog open={showSelectedTriplets} onOpenChange={setShowSelectedTriplets}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("fixed bottom-10 right-10 z-50", {
            "pointer-events-none": selectedTriplets.size === 0,
          })}
          disabled={selectedTriplets.size === 0}
        >
          <ScanIcon className="mr-2" />
          Show Selected Triplet IDs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Selected Triplets</DialogTitle>
          <DialogDescription>
            You have selected {selectedTriplets.size} triplets
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="space-y-2 p-4">
            {Array.from(selectedTriplets).map((id) => (
              <div
                key={id}
                className="flex justify-between items-center bg-secondary p-2 rounded"
              >
                <span className="text-sm font-mono">{id}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeselect(id)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
