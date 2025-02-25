// components/ai-perfume/GenderBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function GenderBadge({ gender }: { gender: string }) {
  const genderMap = {
    women: { label: "For Women", color: "bg-pink-100 text-pink-800" },
    men: { label: "For Men", color: "bg-blue-100 text-blue-800" },
    unisex: { label: "Unisex", color: "bg-purple-100 text-purple-800" },
  };

  return (
    <Badge
      className={cn(
        "text-sm",
        genderMap[gender as keyof typeof genderMap]?.color
      )}
    >
      {genderMap[gender as keyof typeof genderMap]?.label || gender}
    </Badge>
  );
}
