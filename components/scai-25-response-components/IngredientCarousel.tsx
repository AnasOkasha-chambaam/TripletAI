import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface Note {
  name: string;
  avatar: string;
}

interface IngredientCarouselProps {
  ingredients: { top: Note[]; middle: Note[]; base: Note[] };
}

export function IngredientCarousel({
  ingredients: { top, middle, base },
}: IngredientCarouselProps) {
  return (
    <div className="flex flex-col">
      <Carousel className="w-full max-w-xs mx-auto">
        <CarouselContent>
          {top.map((topNote, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Top Note: {topNote.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={topNote.avatar}
                    alt={topNote.name}
                    width={100}
                    height={100}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Carousel className="w-full max-w-xs mx-auto">
        <CarouselContent>
          {middle.map((middleNote, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Middle Note: {middleNote.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={middleNote.avatar}
                    alt={middleNote.name}
                    width={100}
                    height={100}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Carousel className="w-full max-w-xs mx-auto">
        <CarouselContent>
          {base.map((baseNote, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Base Note: {baseNote.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={baseNote.avatar}
                    alt={baseNote.name}
                    width={100}
                    height={100}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
