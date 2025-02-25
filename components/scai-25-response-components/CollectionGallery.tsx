// components/ai-perfume/CollectionGallery.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";

export function CollectionGallery({
  name,
  collection,
}: {
  name: string;
  collection: {
    name: string;
    picture: string;
    url: string;
  }[];
  //   collection: TPerfumePopulated["collectionsPerfume"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name} Collection</CardTitle>
        <CardDescription>
          Related fragrances in the{" "}
          <span className="font-bold underline">{name}</span> line
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {collection.map((perfume) => (
            <a
              key={perfume.name}
              href={perfume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative aspect-square mb-2">
                <Image
                  src={perfume.picture || "/placeholder.svg"}
                  alt={perfume.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                {perfume.name}
              </p>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
