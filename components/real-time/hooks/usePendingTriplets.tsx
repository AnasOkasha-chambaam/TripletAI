import { LiveObject } from "@liveblocks/client";
import {
  useMutation,
  useOthersMapped,
  useSelf,
  useStorage,
} from "@liveblocks/react/suspense";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

const usePendingTriplets = () => {
  const {
    presence: { user: currentUser },
  } = useSelf();

  const connectedUsersIds = useOthersMapped((other) => other.presence.user?.id);

  const pendingTripletsCount = useStorage((root) => root.pendingTripletsCount);

  const lockedTripletsObject = useStorage((root) => root.lockedTriplets);

  const lockedTriplets = useMemo(() => {
    return Object.values(lockedTripletsObject);
  }, [lockedTripletsObject]);

  const removeUserOtherLockedTriplets = useMutation(
    ({ storage }, tripletId: string, userId: string) => {
      const lockedTriplets = storage.get("lockedTriplets");

      const lockedTripletsValues = Object.values(lockedTriplets.toObject());

      // remove the other triplets that are locked by the request owner
      lockedTripletsValues.forEach((triplet) => {
        const lockedByRequestOwner = triplet.get("lockedBy")?.id === userId;
        const isNotTheCurrentTriplet = triplet.get("triplet")._id !== tripletId;

        if (lockedByRequestOwner && isNotTheCurrentTriplet) {
          storage.get("lockedTriplets").delete(triplet.get("triplet")._id);
        }
      });
    },
    []
  );

  const lockedTripletsByOthers = useMemo(() => {
    if (!currentUser) {
      return [];
    }
    return lockedTriplets.filter(
      (lt) =>
        lt.lockedBy.id !== currentUser.id &&
        connectedUsersIds.some((cui) => cui[1] === lt.lockedBy.id)
    );
  }, [lockedTriplets, currentUser, connectedUsersIds]);

  const lockedTripletByOthersIds = useMemo(() => {
    return lockedTripletsByOthers.map((triplet) => triplet.triplet._id);
  }, [lockedTripletsByOthers]);

  const currentTriplet = useMemo(() => {
    if (!currentUser) {
      return;
    }
    return lockedTriplets.find(
      (triplet) => triplet.lockedBy.id === currentUser.id
    )?.["triplet"];
  }, [lockedTriplets, currentUser]);

  const lockTriplet = useMutation(
    (
      { storage, self, others },
      triplet: TTriplet,
      pendingTripletsCount: number
    ) => {
      const {
        presence: { user },
      } = self;

      if (!user) {
        toast.error("User not found");
        return;
      }

      storage.set("pendingTripletsCount", pendingTripletsCount);

      const isTripletLocked = storage.get("lockedTriplets").get(triplet._id); // Checking if the triplet is already locked by another user

      const tripletOwnerId = isTripletLocked?.get("lockedBy").id;

      const isLockedByMe = user.id === tripletOwnerId;

      if (isLockedByMe) {
        toast.info("You locked this triplet.", {
          richColors: false,
          id: triplet._id,
        });
        return;
      }

      const isTripletOwnerOnline = others.some(
        (other) => other.presence.user?.id === tripletOwnerId
      );

      if (isTripletLocked && isTripletOwnerOnline) {
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

  const unlockTriplet = useMutation(
    (
      { storage, self },
      tripletId: string,
      appliedAction: "accept" | "reject" | "edit" | "skip"
    ) => {
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

      const hasReleaseRequest = storage.get("releaseRequests").get(tripletId);

      const isSkippedByCurrentUser = storage
        .get("skippedTriplets")
        .get(user.id)
        ?.get(tripletId);

      if (
        hasReleaseRequest &&
        isSkippedByCurrentUser &&
        appliedAction === "skip"
      ) {
        storage
          .get("lockedTriplets")
          .get(tripletId)
          .set("lockedBy", hasReleaseRequest.get("requestedBy"));
        storage.get("releaseRequests").delete(tripletId);

        toast.success(`Request accepted`, {
          id: `release_${tripletId}`,
          duration: 300,
          action: {
            label: "",
            onClick() {},
            actionButtonStyle: {
              display: "none",
              opacity: 0,
              pointerEvents: "none",
            },
          },
          actionButtonStyle: {
            display: "none",
            opacity: 0,
            pointerEvents: "none",
          },
          richColors: true,
          onDismiss() {},
        });
        removeUserOtherLockedTriplets(
          tripletId,
          hasReleaseRequest.get("requestedBy").id
        );

        return;
      }

      if (hasReleaseRequest && appliedAction !== "skip") {
        storage.get("releaseRequests").delete(tripletId);
        toast.error("Request rejected", {
          id: `release_${tripletId}`,
          duration: 300,
          action: {
            label: "",
            onClick() {},
            actionButtonStyle: {
              display: "none",
              opacity: 0,
              pointerEvents: "none",
            },
          },
          actionButtonStyle: {
            display: "none",
            opacity: 0,
            pointerEvents: "none",
          },
          richColors: true,
          onDismiss() {},
        });
      }

      storage.get("lockedTriplets").delete(tripletId);
    },
    []
  );

  const forceUnlockTriplet = useMutation(({ storage }, tripletId: string) => {
    storage.get("lockedTriplets").delete(tripletId);
    storage.get("releaseRequests").delete(tripletId);
  }, []);

  const setPendingTripletsCount = useMutation(({ storage }, count: number) => {
    storage.set("pendingTripletsCount", count);
  }, []);

  const resetLockedTriplet = useMutation(({ storage }, tripletId: string) => {
    storage.get("lockedTriplets").delete(tripletId);
  }, []);

  // unlock current triplet if pending triplets count is 0
  useEffect(() => {
    if (pendingTripletsCount === 0 && currentTriplet) {
      resetLockedTriplet(currentTriplet._id);
    }
  }, [pendingTripletsCount, currentTriplet]);

  return {
    pendingTripletsCount,
    lockedTriplets,
    lockedTripletsByOthers,
    setPendingTripletsCount,
    forceUnlockTriplet,
    removeUserOtherLockedTriplets,
    currentTriplet,
    lockedTripletByOthersIds,
    lockTriplet,
    unlockTriplet,
  };
};

export default usePendingTriplets;
