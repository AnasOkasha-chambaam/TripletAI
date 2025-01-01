import { motion } from "framer-motion";

export function LoaderOfFilteringTriplets() {
  return (
    <div className="flex justify-center items-center h-64">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-4 h-4 bg-primary rounded-full"
            animate={{
              y: [0, -20, 0],
              backgroundColor: [
                "var(--primary)",
                "var(--secondary)",
                "var(--primary)",
              ],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
