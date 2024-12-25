import { useMyPresence } from "@liveblocks/react";

const useSkippedTriplets = () => {
  const [myPresence, updateMyPresence] = useMyPresence();

  const skippedTripletIds = myPresence.skippedTripletIds;

  const skipTriplet = (tripletId: string) => {
    updateMyPresence({
      skippedTripletIds: [...skippedTripletIds, tripletId],
    });
  };

  const isSkippedTriplet = (triplet: TTriplet) => {
    return skippedTripletIds.includes(triplet.id);
  };

  const clearSkippedTriplets = () => {
    updateMyPresence({
      skippedTripletIds: [],
    });
  };

  return {
    skippedTripletIds,
    noSkippedTriplets: skippedTripletIds.length === 0,
    skipTriplet,
    isSkippedTriplet,
    clearSkippedTriplets,
  };
};

export default useSkippedTriplets;
