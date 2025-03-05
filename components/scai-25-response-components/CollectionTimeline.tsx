import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Perfume {
  name: string;
  // launchYear?: number;
  picture: string;
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
              <Image
                src={perfume.picture}
                alt={perfume.name}
                width={50}
                height={50}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
