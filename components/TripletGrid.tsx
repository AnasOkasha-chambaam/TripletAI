import SingleTripletCard from "@/components/shared/SingleTripletCard";
import { Badge } from "./ui/badge";
import { InfoIcon } from "lucide-react";

interface TripletGridProps {
  triplets: TTriplet[];
  onSelect?: (triplet: TTriplet) => void;
  selectedTriplets?: Map<string, TTriplet>;
  onEdit?: (triplet: TTriplet) => void;
}

export function TripletGrid({
  triplets,
  onSelect,
  selectedTriplets,
  onEdit,
}: TripletGridProps) {
  return triplets.length <= 0 ? (
    <div className="flex justify-center items-center my-7 w-full">
      <Badge className="mx-auto scale-110 p-3 rounded-md" variant={"secondary"}>
        <InfoIcon className="mr-2 size-4" /> No Triplets
      </Badge>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {triplets.map((triplet) => (
        <SingleTripletCard
          key={triplet._id}
          triplet={triplet}
          isSelected={selectedTriplets?.has(triplet._id)}
          onSelect={onSelect && (() => onSelect(triplet))}
          onEdit={onEdit ? () => onEdit(triplet) : undefined}
        />
      ))}
    </div>
  );
}
