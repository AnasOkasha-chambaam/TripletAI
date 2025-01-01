import SingleTripletCard from "@/components/shared/SingleTripletCard";

interface TripletGridProps {
  triplets: TTriplet[];
  onSelect?: (id: string) => void;
  selectedTriplets?: string[];
  onEdit?: (triplet: TTriplet) => void;
}

export function TripletGrid({
  triplets,
  onSelect,
  selectedTriplets,
  onEdit,
}: TripletGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {triplets.map((triplet) => (
        <SingleTripletCard
          key={triplet._id}
          triplet={triplet}
          isSelected={selectedTriplets?.includes(triplet._id)}
          onSelect={onSelect ? () => onSelect(triplet._id) : undefined}
          onEdit={onEdit ? () => onEdit(triplet) : undefined}
        />
      ))}
    </div>
  );
}
