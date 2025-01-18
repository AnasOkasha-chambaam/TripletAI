import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { StepVisual } from "./StepVisual";
import { Separator } from "./ui/separator";
export type TStep = {
  title: string;
  description: string;
  icon: string;
};

export function Section({
  step,
  index,
}: // totalSteps,
{
  step: TStep;
  index: number;
  totalSteps: number;
}) {
  const singleSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: singleSectionRef,
    offset: ["start 50%", "end 60%"],
  });

  const textProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const dynamicBorderWidth = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.8],
    ["0px", "50px", "5px", "0px"]
  );

  return (
    <>
      <motion.div
        ref={singleSectionRef}
        //   style={{ opacity, scale, x, rotateY }}
        className="flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-10"
      >
        <div className="flex-1">
          <motion.h3 className="relative text-2xl font-semibold mb-4">
            <motion.span className="w-full opacity-10">
              {index + 1}. {step.title}
            </motion.span>
            <motion.span
              className="absolute inset-0 text-primary/75 brightness-110 overflow-hidden"
              style={{
                width: textProgress,
                borderRightWidth: dynamicBorderWidth,
              }}
            >
              <motion.span className="block min-w-max">
                {index + 1}. {step.title}
              </motion.span>
            </motion.span>
          </motion.h3>
          <motion.p className="text-lg text-muted-foreground">
            {step.description}
          </motion.p>
        </div>
        <div className="flex-1">
          <div className="relative mx-auto flex items-center justify-center">
            <StepVisual step={step} index={index} />
          </div>
        </div>
      </motion.div>
      <Separator />
    </>
  );
}
