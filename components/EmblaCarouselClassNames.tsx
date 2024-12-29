import { cn } from "@/lib/utils";
import type { EmblaOptionsType } from "embla-carousel";
import ClassNames from "embla-carousel-class-names";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import SingleTripletCard from "./shared/SingleTripletCard";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

type EmblaCarouselProps = {
  slides: {
    triplet: TTriplet;
    lockedBy: TLockedBy;
  }[];
  options?: EmblaOptionsType;
};

export default function EmblaCarouselClassNames({
  slides,
  options,
}: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [ClassNames()]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="max-w-3xl w-80 sm:w-96 mx-auto my-3">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-1 touch-pan-y">
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
                "relative flex-[0_0_95%] sm:flex-[0_0_85%] min-w-0 pl-1 transition-opacity duration-200 ease-in-out opacity-35",
                {
                  "opacity-100": selectedIndex === index,
                }
              )}
              key={index}
            >
              <SingleTripletCard
                triplet={slide.triplet}
                lockedBy={slide.lockedBy} // Add this line
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
                {slides[index]?.lockedBy && (
                  <Avatar className="scale-75">
                    <AvatarImage
                      src={slides[index].lockedBy.picture}
                      alt={slides[index].lockedBy.username}
                    />
                    <AvatarFallback>
                      {slides[index].lockedBy.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
