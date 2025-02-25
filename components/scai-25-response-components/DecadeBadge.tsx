import { Badge } from "@/components/ui/badge";

interface DecadeBadgeProps {
  year?: number;
}

export function DecadeBadge({ year }: DecadeBadgeProps) {
  if (!year) return null;

  const decade = Math.floor(year / 10) * 10;
  return <Badge variant="secondary">{`${decade}s`}</Badge>;
}
