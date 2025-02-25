// components/ai-perfume/FragranceFamilyChip.tsx
import { Badge } from "@/components/ui/badge";

export function FragranceFamilyChip({ family }: { family: string }) {
  const familyColors: Record<string, string> = {
    floral: "bg-red-100 text-red-800",
    citrus: "bg-yellow-100 text-yellow-800",
    woody: "bg-amber-100 text-amber-800",
    fresh: "bg-green-100 text-green-800",
    oriental: "bg-purple-100 text-purple-800",
  };

  return (
    <Badge
      className={`${
        familyColors[family.toLowerCase()] || "bg-gray-100"
      } capitalize`}
    >
      {family}
    </Badge>
  );
}
