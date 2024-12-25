import { LiveObject } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";
import { useStorage } from "@liveblocks/react/suspense";
import { useEffect } from "react";
import { toast } from "sonner";
import useSkippedTriplets from "./useSkippedTriplets";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RELEASE_TIMEOUT = 30000; // 30 seconds in milliseconds

export const useReleaseTriplet = (currentTriplet: TTriplet | null) => {
  const { skipTriplet } = useSkippedTriplets();

  const releaseRequests = useStorage((root) => root.releaseRequests);

  const releaseRequestOfCurrentTriplet = currentTriplet
    ? releaseRequests[currentTriplet._id]
    : null;

  const requestRelease = useMutation(
    ({ storage, self }, tripletId: string, message: string) => {
      toast.info("Test: " + tripletId, {
        description: message,
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
        toast.info("This triplet already have been requested to release.");
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
    ({ storage }) => {
      if (!currentTriplet) {
        toast.error("No triplet to release");
        return;
      }

      const tripletHasAReleaseRequest = !!storage
        .get("releaseRequests")
        .get(currentTriplet._id);

      if (!tripletHasAReleaseRequest) {
        toast.error("No release request for this triplet");
        return;
      }

      skipTriplet(currentTriplet._id);

      storage.get("releaseRequests").delete(currentTriplet._id);
    },
    [currentTriplet, skipTriplet]
  );

  const dismissReleaseRequest = useMutation(
    ({ storage }) => {
      if (!currentTriplet) {
        toast.error("No triplet to release");
        return;
      }

      const tripletHasAReleaseRequest = !!storage
        .get("releaseRequests")
        .get(currentTriplet._id);

      if (!tripletHasAReleaseRequest) {
        toast.error("No release request for this triplet");
        return;
      }

      storage.get("releaseRequests").delete(currentTriplet._id);

      toast.info("Release request dismissed");
    },
    [currentTriplet]
  );

  useEffect(() => {
    if (!currentTriplet) return;
    console.log("currentTriplet", currentTriplet);
    console.log("releaseRequests", releaseRequests);

    const currentTripletHasAReleaseRequest =
      releaseRequests[currentTriplet._id];
    if (!currentTripletHasAReleaseRequest) return;

    const timeout = setTimeout(() => {
      toast.info("Release request has expired", {
        description: "Triplet has been skipped due to inactivity",
      });
      acceptReleaseRequest();
    }, RELEASE_TIMEOUT);

    toast(
      `Release request from ${currentTripletHasAReleaseRequest.requestedBy.username}`,
      {
        description: () => {
          return (
            <div>
              <div className="flex gap-1 items-center">
                <Avatar className="scale-50">
                  <AvatarImage
                    src={currentTripletHasAReleaseRequest.requestedBy.picture}
                  />
                  <AvatarFallback>
                    {currentTripletHasAReleaseRequest.requestedBy.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {currentTripletHasAReleaseRequest.requestedBy.username}
              </div>
              <p className="ml-2 p-3 bg-muted text-muted-foreground rounded">
                {currentTripletHasAReleaseRequest.message}
              </p>
            </div>
          );
        },
        duration: RELEASE_TIMEOUT,
        position: "bottom-right",
        action: {
          label: "Accept",
          onClick: () => {
            clearTimeout(timeout);
            acceptReleaseRequest();
          },
        },
        onDismiss: () => {
          clearTimeout(timeout);
          dismissReleaseRequest();
        },
      }
    );

    return () => clearTimeout(timeout);
  }, [currentTriplet, releaseRequestOfCurrentTriplet]);

  return {
    requestRelease,
    acceptReleaseRequest,
    dismissReleaseRequest,
    currentTripletHasAReleaseRequest: !!releaseRequestOfCurrentTriplet,
  };
};
