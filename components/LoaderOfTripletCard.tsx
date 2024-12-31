import { motion } from "framer-motion";

export const LoaderOfTripletCard = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {/* <motion.div
        className="w-full h-6 bg-gray-200 rounded-md overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </motion.div> */}
      <motion.div
        className="w-3/4 h-9 bg-gradient-to-r from-green-400 to-blue-500 rounded-md overflow-hidden"
        initial={{ width: "10%" }}
        animate={{ width: "75%" }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {/* <motion.div
          className="h-full bg-green-500 w-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        /> */}
      </motion.div>
      {/* <motion.div
        className="w-full h-24 bg-gray-200 rounded-md overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="h-full bg-purple-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </motion.div> */}
      <p className="text-sm text-muted-foreground mt-4 animate-pulse">
        Loading triplet data...
      </p>
    </div>
  );
};
