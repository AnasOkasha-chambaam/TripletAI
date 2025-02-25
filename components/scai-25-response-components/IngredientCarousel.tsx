import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Note {
  name: string;
  description?: string;
}

interface IngredientCarouselProps {
  ingredients: { top: Note; heart: Note; base: Note };
}

export function IngredientCarousel({
  ingredients: { top, heart, base },
}: IngredientCarouselProps) {
  const notes = [
    { ...top, type: "Top" },
    { ...heart, type: "Heart" },
    { ...base, type: "Base" },
  ];

  return (
    <Carousel className="w-full max-w-xs mx-auto">
      <CarouselContent>
        {notes.map((note, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {note.type} Note: {note.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {note.description || "A key ingredient in this fragrance."}
                </p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
