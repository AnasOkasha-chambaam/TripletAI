import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export function PerfumersList({
  perfumers,
}: {
  perfumers: {
    name: string;
    avatar: string;
    url: string;
  }[];
  //   perfumers: TPerfumePopulated["perfumers"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfumers</CardTitle>
        <CardDescription>The noses behind this fragrance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {perfumers.map((perfumer) => (
            <Button key={perfumer.name} variant="outline" asChild>
              <a
                href={perfumer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Image
                  src={perfumer.avatar || "/placeholder.svg"}
                  alt={perfumer.name}
                  width={30}
                  height={30}
                  className="rounded-full mr-2"
                />
                {perfumer.name}
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
