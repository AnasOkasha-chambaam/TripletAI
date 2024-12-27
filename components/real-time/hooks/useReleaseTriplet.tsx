import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSingleTriplet } from "@/lib/actions/triplet.actions";
import { LiveObject } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";
import { useSelf, useStorage } from "@liveblocks/react/suspense";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import usePendingTriplets from "./usePendingTriplets";

const RELEASE_TIMEOUT = 30000; // 30 seconds in milliseconds

export const useReleaseTriplet = () => {
  const { currentTriplet, removeUserOtherLockedTriplets } =
    usePendingTriplets();

  const {
    presence: { user },
  } = useSelf();

  const releaseRequests = useStorage((root) => root.releaseRequests);

  const releaseRequestOfCurrentTriplet = useMemo(() => {
    if (!user) return;

    if (!currentTriplet) return;

    const hasReleaseRequest = releaseRequests[currentTriplet._id];

    if (!hasReleaseRequest) return;

    const requestedByMe = hasReleaseRequest.requestedBy.id === user.id;

    if (requestedByMe) return;

    console.log("hasReleaseRequest", hasReleaseRequest, currentTriplet, user);

    return hasReleaseRequest;
  }, [currentTriplet, releaseRequests, user]);

  const requestRelease = useMutation(
    ({ storage, self }, tripletId: string, message: string) => {
      toast.info("Test: " + tripletId, {
        description: message,
        richColors: false,
      });
      const { presence } = self;
      if (!presence.user) {
        toast.error("You must be logged in to request a release");
        return;
      }

      const hasARequestAlready = !!storage
        .get("releaseRequests")
        .get(tripletId);

      if (hasARequestAlready) {
        toast.info("This triplet already have been requested to release.", {
          richColors: false,
        });
        return;
      }

      storage.get("releaseRequests").set(
        tripletId,
        new LiveObject({
          requestedBy: presence.user,
          message,
        })
      );
    },
    []
  );

  const acceptReleaseRequest = useMutation(
    async ({ storage, self }, tripletId: string) => {
      const {
        presence: { user },
      } = self;
      if (!user) return;

      const releaseRequest = storage.get("releaseRequests").get(tripletId);

      if (!releaseRequest) {
        toast.error("No release request for this triplet");
        return;
      }

      const lockedBy = storage
        .get("lockedTriplets")
        .get(tripletId)
        ?.get("lockedBy");

      if (!lockedBy || lockedBy.id !== user.id) {
        toast.error("You are not the owner of this triplet");
        return;
      }

      const receivingUser = releaseRequest.get("requestedBy");

      const triplet = await getSingleTriplet(tripletId);

      if (!triplet) {
        toast.error("Triplet not found");
        return;
      }

      const isPending = triplet.status === "pending";

      if (!isPending) {
        toast.error("Triplet is not pending");
        storage.get("lockedTriplets").delete(tripletId);
        return;
      }

      storage
        .get("lockedTriplets")
        .get(tripletId)
        .set("lockedBy", receivingUser);

      storage.get("releaseRequests").delete(tripletId);

      // clean the other triplets that may be locked by the user
      const lockedTriplets = storage.get("lockedTriplets");

      const lockedTripletsValues = Object.values(lockedTriplets.toObject());

      // remove the other triplets that are locked by the request owner
      removeUserOtherLockedTriplets(tripletId, receivingUser.id);

      toast.success("Triplet moved successfully");
    },
    [getSingleTriplet, removeUserOtherLockedTriplets]
  );

  const dismissReleaseRequest = useMutation(
    ({ storage, self }, tripletId: string) => {
      const {
        presence: { user },
      } = self;

      if (!user) return;

      const currentTriplet = storage.get("lockedTriplets").get(tripletId);

      if (!currentTriplet) {
        toast.error("Triplet not found");
        return;
      }

      const tripletHasAReleaseRequest = !!storage
        .get("releaseRequests")
        .get(tripletId);

      if (!tripletHasAReleaseRequest) {
        toast.error("No release request for this triplet");
        return;
      }

      if (currentTriplet.get("lockedBy").id !== user.id) {
        toast.error("You are not the owner of this release request");
        return;
      }

      storage.get("releaseRequests").delete(tripletId);

      toast.info("Release request dismissed", {
        richColors: false,
      });
    },
    []
  );

  useEffect(() => {
    if (!currentTriplet) return;

    if (!releaseRequestOfCurrentTriplet) return;

    const timeout = setTimeout(() => {
      toast.info("Release request has expired", {
        description: "Triplet has been skipped due to inactivity",
        richColors: false,
      });
      acceptReleaseRequest(currentTriplet._id);
    }, RELEASE_TIMEOUT);

    toast(
      `Release request from ${releaseRequestOfCurrentTriplet.requestedBy.username}`,
      {
        description: () => {
          return (
            <div className="bg-card p-2 rounded-xl">
              <div className="flex gap-1 items-center">
                <Avatar className="scale-50">
                  <AvatarImage
                    src={releaseRequestOfCurrentTriplet.requestedBy.picture}
                  />
                  <AvatarFallback>
                    {releaseRequestOfCurrentTriplet.requestedBy.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {releaseRequestOfCurrentTriplet.requestedBy.username}
              </div>
              <p className="ml-2 p-3 bg-muted text-muted-foreground rounded">
                {releaseRequestOfCurrentTriplet.message}
              </p>
            </div>
          );
        },
        id: `release_${currentTriplet._id}`,
        duration: RELEASE_TIMEOUT,
        position: "bottom-right",
        action: {
          label: "Accept",
          onClick: () => {
            clearTimeout(timeout);
            acceptReleaseRequest(currentTriplet._id);
          },
        },
        onDismiss: () => {
          clearTimeout(timeout);
          dismissReleaseRequest(currentTriplet._id);
        },
      }
    );

    return () => clearTimeout(timeout);
  }, [currentTriplet, releaseRequestOfCurrentTriplet, dismissReleaseRequest]);

  return {
    requestRelease,
    acceptReleaseRequest,
    dismissReleaseRequest,
    removeUserOtherLockedTriplets,
    currentTripletHasAReleaseRequest: !!releaseRequestOfCurrentTriplet,
  };
};
