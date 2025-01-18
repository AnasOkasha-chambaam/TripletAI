"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Section } from "./SingleSubSectionOfHowItWorks";

const steps = [
  {
    title: "Initiate your application",
    // description: "Get started by setting up your Triplet AI application.",
    description: "Get started by having an account on Triplet AI.",

    icon: "🚀",
  },
  {
    title: "Add Triplets to your application",
    description: "Create and add new triplets to train your AI model.",
    icon: "➕",
  },
  {
    title: "Import multiple triplets to the pending Triplets",
    description: "Bulk import triplets to streamline your workflow.",
    icon: "📥",
  },
  {
    title: "Swipe Triplets to take different actions",
    description: "Efficiently manage triplets with intuitive swipe actions.",
    icon: "👆",
  },
  {
    title: "Enjoy real-time updates",
    description:
      "Experience seamless, instant updates across your application.",
    icon: "⚡",
  },
  {
    title: "Export Triplets to train your model",
    description: "Prepare your data for model training with easy exports.",
    icon: "📤",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 50%", "end end"],
  });

  const headlineProgress = useTransform(
    scrollYProgress,
    [0, 0.2],
    ["0%", "100%"]
  );

  return (
    <div ref={containerRef} className="py-24 space-y-24">
      <div className="min-h-screen relative ">
        <div className=" top-0 p-12 overflow-hidden bg-card">
          <div className="relative mx-auto max-w-max">
            <h2 className="text-4xl font-bold text-center opacity-10">
              How It Works?
            </h2>
            <motion.div
              className="absolute inset-0 overflow-hidden"
              style={{ width: headlineProgress }}
            >
              <h2 className="text-4xl font-bold text-center text-primary min-w-max">
                How It Works?
              </h2>
            </motion.div>
          </div>
        </div>

        <div>
          {steps.map((step, index) => (
            <Section
              key={index}
              step={step}
              index={index}
              totalSteps={steps.length}
            />
          ))}
        </div>
        {/* <div className="space-y-96">
          </div> */}
      </div>
    </div>
  );
}
