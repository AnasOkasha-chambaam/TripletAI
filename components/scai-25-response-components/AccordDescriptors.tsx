import { Badge } from "@/components/ui/badge";

interface AccordDescriptorsProps {
  primary: string;
  secondary?: string;
}

export function AccordDescriptors({
  primary,
  secondary,
}: AccordDescriptorsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default" className="text-sm">
        {primary}
      </Badge>
      {secondary && (
        <Badge variant="outline" className="text-sm">
          {secondary}
        </Badge>
      )}
    </div>
  );
}
