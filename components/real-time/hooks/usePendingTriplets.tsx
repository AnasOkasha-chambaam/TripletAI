import { LiveObject } from "@liveblocks/client";
import { useMutation, useSelf, useStorage } from "@liveblocks/react/suspense";
import { useMemo } from "react";
import { toast } from "sonner";

const usePendingTriplets = () => {
  const {
    presence: { user: currentUser },
  } = useSelf();

  const pendingTripletsCount = useStorage((root) => root.pendingTripletsCount);

  const lockedTripletsObject = useStorage((root) => root.lockedTriplets);

  const lockedTriplets = useMemo(() => {
    return Object.values(lockedTripletsObject);
  }, [lockedTripletsObject]);

  const lockedTripletsByOthers = useMemo(() => {
    if (!currentUser) {
      return [];
    }
    return lockedTriplets.filter(
      (triplet) => triplet.lockedBy.id !== currentUser.id
    );
  }, [lockedTriplets, currentUser]);

  const lockedTripletIds = useMemo(() => {
    return lockedTriplets.map((triplet) => triplet.triplet._id);
  }, [lockedTriplets]);

  const currentTriplet = useMemo(() => {
    if (!currentUser) {
      return;
    }
    return lockedTriplets.find(
      (triplet) => triplet.lockedBy.id === currentUser.id
    )?.["triplet"];
  }, [lockedTriplets, currentUser]);

  const lockTriplet = useMutation(
    ({ storage, self }, triplet: TTriplet, pendingTripletsCount: number) => {
      const {
        presence: { user },
      } = self;

      if (!user) {
        toast.error("User not found");
        return;
      }

      storage.set("pendingTripletsCount", pendingTripletsCount);

      const isTripletLocked = storage.get("lockedTriplets").get(triplet._id); // Checking if the triplet is already locked by another user

      const isLockedByMe = isTripletLocked?.get("lockedBy").id === user.id;

      if (isLockedByMe) {
        toast.info("You locked this triplet.", {
          richColors: false,
          id: triplet._id,
        });
        return;
      }

      if (isTripletLocked) {
        toast.error("Triplet is already locked by another user");
        return;
      }

      storage.get("lockedTriplets").set(
        triplet._id,
        new LiveObject({
          triplet,
          lockedBy: user,
        })
      );

      toast.success("Triplet locked successfully", {
        description: `Total pending triplets: ${pendingTripletsCount}`,
      });
    },
    []
  );

  const unlockTriplet = useMutation(({ storage, self }, tripletId: string) => {
    const {
      presence: { user },
    } = self;

    if (!user) {
      toast.error("User not found");
      return;
    }

    const isTripletLockedByMe =
      storage.get("lockedTriplets").get(tripletId)?.get("lockedBy").id ===
      user.id;

    if (!isTripletLockedByMe) {
      toast.error("Triplet is not locked by you");
      return;
    }

    storage.get("lockedTriplets").delete(tripletId);
    toast.success("Triplet unlocked successfully");
  }, []);

  const forceUnlockTriplet = useMutation(({ storage }, tripletId: string) => {
    storage.get("lockedTriplets").delete(tripletId);
  }, []);

  const setPendingTripletsCount = useMutation(({ storage }, count: number) => {
    storage.set("pendingTripletsCount", count);
  }, []);

  //   useEffect(() => {
  //     return () => {
  //       if (currentTriplet) {
  //         console.log("unlocking", currentTriplet.instruction);
  //         unlockTriplet(currentTriplet._id);
  //       }
  //     };
  //   }, [currentTriplet, unlockTriplet]);

  return {
    pendingTripletsCount,
    lockedTriplets,
    lockedTripletsByOthers,
    setPendingTripletsCount,
    forceUnlockTriplet,
    currentTriplet,
    lockedTripletIds,
    lockTriplet,
    unlockTriplet,
  };
};

export default usePendingTriplets;
