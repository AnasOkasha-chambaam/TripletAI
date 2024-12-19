import { LiveList } from "@liveblocks/client";
import { useMutation, useStorage } from "@liveblocks/react";

export function useRealtimeTriplets() {
  const triplets = useStorage((root) => root.triplets);

  const updateTriplet = useMutation(({ storage }, triplet: TTriplet) => {
    const triplets = storage.get("triplets") as LiveList<TTriplet>;
    const index = triplets.findIndex((t) => t._id === triplet._id);
    if (index !== -1) {
      triplets.set(index, triplet);
    }
  }, []);

  const addTriplet = useMutation(({ storage }, triplet: TTriplet) => {
    const triplets = storage.get("triplets") as LiveList<TTriplet>;
    triplets.push(triplet);
  }, []);

  const removeTriplet = useMutation(({ storage }, tripletId: string) => {
    const triplets = storage.get("triplets") as LiveList<TTriplet>;
    const index = triplets.findIndex((t) => t._id === tripletId);
    if (index !== -1) {
      triplets.delete(index);
    }
  }, []);

  return {
    triplets: triplets ? Array.from(triplets) : [],
    updateTriplet,
    addTriplet,
    removeTriplet,
  };
}
