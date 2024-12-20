import { cn } from "@/lib/utils";
import type { EmblaOptionsType } from "embla-carousel";
import ClassNames from "embla-carousel-class-names";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import SingleTripletCard from "./shared/SingleTripletCard";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Slide = {
  idx: number;
  lockedBy: {
    picture: string;
    name: string;
  };
};

type EmblaCarouselProps = {
  slides: Slide[];
  options?: EmblaOptionsType;
};

export default function EmblaCarouselClassNames({
  slides,
  options,
}: EmblaCarouselProps) {
  // @ts-ignore - TypeScript complains about the second argument, but it works so, who cares?
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [ClassNames()]);
  const [selectedIndex, setSelectedIndex] = useState(
    Math.min(0, slides.length - 1)
  );
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  const onSelect = () => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  };

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="max-w-3xl w-80 md:w-96 mx-auto my-3">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 touch-pan-y">
          {slides.length === 0 && (
            <div className="flex-[0_0_70%] min-w-0 pl-4 transition-opacity duration-200 ease-in-out">
              <Image
                src="https://placehold.co/600x400.png?text=No+Image"
                alt="No Image"
                width={300}
                height={200}
                className="block h-52 w-full object-cover rounded-3xl"
              />
            </div>
          )}
          {slides.map((slide, index) => (
            <div
              className={cn(
                "relative flex-[0_0_70%] min-w-0 pl-4 transition-opacity duration-200 ease-in-out opacity-35",
                {
                  "opacity-100": selectedIndex === index,
                }
              )}
              key={index}
            >
              <SingleTripletCard
                triplet={{
                  _id: "1",
                  id: "1",
                  instruction:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem impedit soluta obcaecati non itaque! Ea minus, impedit, magnam explicabo reprehenderit tempora fugit nesciunt voluptates molestiae optio quis. Nisi, quibusdam! Numquam explicabo quibusdam inventore deserunt laboriosam fuga expedita neque hic excepturi, sit suscipit nostrum quidem fugit, sunt minus dolor necessitatibus dolorum?",
                  input:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem impedit soluta obcaecati non itaque! Ea minus, impedit, magnam explicabo reprehenderit tempora fugit nesciunt voluptates molestiae optio quis. Nisi, quibusdam! Numquam explicabo quibusdam inventore deserunt laboriosam fuga expedita neque hic excepturi, sit suscipit nostrum quidem fugit, sunt minus dolor necessitatibus dolorum?",
                  output:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem impedit soluta obcaecati non itaque! Ea minus, impedit, magnam explicabo reprehenderit tempora fugit nesciunt voluptates molestiae optio quis. Nisi, quibusdam! Numquam explicabo quibusdam inventore deserunt laboriosam fuga expedita neque hic excepturi, sit suscipit nostrum quidem fugit, sunt minus dolor necessitatibus dolorum?",
                  status: "pending",
                  createdAt: "2021-09-01T00:00:00.000Z",
                  updatedAt: "2021-09-01T00:00:00.000Z",
                }}
                lockedBy={{
                  picture: "https://placehold.co/600x400.png?text=No+Image",
                  name: "Test User",
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr] justify-between gap-5 mt-3">
        <div className="grid grid-cols-2 gap-2 items-center">
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="rounded-[50%]"
          >
            <ChevronLeft className="size-7" />
          </Button>
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="rounded-[50%]"
          >
            <ChevronRight className="size-7" />
          </Button>
        </div>
        <div className="flex flex-wrap justify-end items-center -mr-2">
          {scrollSnaps.map((_, index) => {
            const isActive = index === selectedIndex;
            return (
              <Button
                key={index}
                variant={"ghost"}
                size={"icon"}
                onClick={() => scrollTo(index)}
                className={cn("rounded-[50%]", {
                  "border-2": isActive,
                })}
              >
                {/* <Circle
                  className={cn("size-4 text-muted-foreground", {
                    "text-primary": isActive,
                  })}
                /> */}
                <Avatar className="scale-75">
                  <AvatarImage
                    src={slides[index].lockedBy.picture}
                    alt={slides[index].lockedBy.name}
                  />
                  <AvatarFallback>
                    {slides[index].lockedBy.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
