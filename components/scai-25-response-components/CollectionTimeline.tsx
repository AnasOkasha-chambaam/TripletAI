import { Card, CardContent } from "@/components/ui/card";

interface Perfume {
  name: string;
  launchYear?: number;
}

interface CollectionTimelineProps {
  timelineItems: Perfume[];
}

export function CollectionTimeline({ timelineItems }: CollectionTimelineProps) {
  return (
    <div className="space-y-4">
      {timelineItems.map((perfume, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{perfume.name}</span>
              {perfume.launchYear && (
                <span className="text-sm text-muted-foreground">
                  {perfume.launchYear}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
