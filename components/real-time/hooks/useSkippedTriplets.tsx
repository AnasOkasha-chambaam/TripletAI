import { LiveObject } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";
import { useSelf, useStorage } from "@liveblocks/react/suspense";
import { useMemo } from "react";
import { toast } from "sonner";
import usePendingTriplets from "./usePendingTriplets";

const useSkippedTriplets = () => {
  const { unlockTriplet } = usePendingTriplets();

  const {
    presence: { user },
  } = useSelf();

  const AllSkippedTripletIdsObject = useStorage((root) => root.skippedTriplets);

  const skippedTripletIdsObject = useMemo(() => {
    if (!user) return {};
    return AllSkippedTripletIdsObject[user.id] || {};
  }, [AllSkippedTripletIdsObject, user]);

  const skippedTripletIds = useMemo(
    () => Object.keys(skippedTripletIdsObject),
    [skippedTripletIdsObject]
  );

  const skipTriplet = useMutation(
    ({ storage, self }, tripletId: string) => {
      console.log("triplet.id", tripletId);

      const {
        presence: { user },
      } = self;
      if (!user) return;

      const hasSkippedBefore = storage.get("skippedTriplets").get(user.id);

      if (!hasSkippedBefore) {
        storage.get("skippedTriplets").set(
          user.id,
          new LiveObject({
            [tripletId]: true,
          })
        );

        toast.info("Triplet skipped", {
          richColors: false,
        });
        return;
      }

      hasSkippedBefore?.set(tripletId, true);

      unlockTriplet(tripletId);

      toast.info("Triplet skipped", {
        richColors: false,
      });
    },
    [unlockTriplet]
  );

  const isSkippedTriplet = useMutation(
    ({ storage, self }, triplet: TTriplet) => {
      const {
        presence: { user },
      } = self;
      if (!user) return;

      return !!storage.get("skippedTriplets").get(user.id)?.get(triplet.id);
    },
    []
  );

  const clearSkippedTriplets = useMutation(({ storage, self }) => {
    const {
      presence: { user },
    } = self;
    if (!user) return;

    storage.get("skippedTriplets").set(user.id, new LiveObject({}));
  }, []);

  return {
    skippedTripletIds,
    noSkippedTriplets: skippedTripletIds.length === 0,
    skipTriplet,
    isSkippedTriplet,
    clearSkippedTriplets,
  };
};

export default useSkippedTriplets;
