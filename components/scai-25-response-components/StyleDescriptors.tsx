import { Badge } from "@/components/ui/badge";

interface StyleDescriptorsProps {
  accords: string[];
}

export function StyleDescriptors({ accords }: StyleDescriptorsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {accords.map((accord, index) => (
        <Badge
          key={index}
          variant={index === 0 ? "default" : "outline"}
          className="text-sm"
        >
          {accord}
        </Badge>
      ))}
    </div>
  );
}
