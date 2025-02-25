import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function PerfumeImageCard({
  perfume: { name, image, url },
}: {
  perfume: { name: string; image: string; url: string };
}) {
  return (
    <div className="relative group flex items-center justify-center overflow-clip h-96 border-2 p-11 max-w-sm mx-auto">
      <Image
        src={image || "/placeholder.svg"}
        alt={name}
        width={210}
        height={200}
        className="rounded-lg mx-auto shadow-lg transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Button variant="outline" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Fragrantica
          </a>
        </Button>
      </div>
    </div>
  );
}
