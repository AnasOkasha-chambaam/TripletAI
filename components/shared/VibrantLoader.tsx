"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface IEnhancedVibrantLoaderProps {
  duration?: number;
  onComplete?: () => void;
}

export const EnhancedVibrantLoader: React.FC<IEnhancedVibrantLoaderProps> = ({
  duration = 3000,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 85) {
          clearInterval(interval);
          onComplete?.();
          return 100;
        }
        return prevProgress + 3;
      });
    }, duration / 100);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div
      className={cn("flex flex-col items-center justify-center min-h-[50vh]", {
        "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900":
          false, // skipped intentionally
      })}
    >
      <div className="text-xl font-bold mb-2 animate-pulse">
        Preparing Triplets
      </div>

      <div className="w-64 bg-muted rounded-full p-2 shadow-lg">
        <motion.div
          className="h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <motion.div
        className="text-3xl font-bold mt-4 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {progress}%
      </motion.div>
      <div className="mt-8 flex space-x-4">
        <AnimatePresence>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-4 h-4 bg-foreground rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              exit={{ scale: 0 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.2,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Loading, {progress} percent complete
      </div>
    </div>
  );
};
