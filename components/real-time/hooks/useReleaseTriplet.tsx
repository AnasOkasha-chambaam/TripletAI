import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getSingleTriplet } from "@/lib/actions/triplet.actions";
import { LiveObject } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";
import { useSelf, useStorage } from "@liveblocks/react/suspense";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import usePendingTriplets from "./usePendingTriplets";

const RELEASE_TIMEOUT = 3000; // 30 seconds in milliseconds // TODO: Change this to 30 seconds

const RequestSentToast = ({
  currentTriplet,
}: {
  currentTriplet: LiveObject<TLockedTriplet>;
}) => (
  <>
    <div className="flex items-center bg-card p-2 gap-2">
      Waiting for{" "}
      <div className="flex items-center gap-1">
        <Avatar className="size-5">
          <AvatarImage
            src={currentTriplet.get("lockedBy").picture}
            alt={currentTriplet.get("lockedBy").username}
          />
          <AvatarFallback>
            {currentTriplet.get("lockedBy").username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>{" "}
        <Badge variant={"outline"} className="items-center rounded-md">
          {currentTriplet.get("lockedBy").username}
        </Badge>
      </div>
    </div>
  </>
);

const ReleaseRequestToast = ({
  releaseRequestOfCurrentTriplet,
}: {
  releaseRequestOfCurrentTriplet: TReleaseRequestValue;
}) => {
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
};

export const useReleaseTriplet = () => {
  const { currentTriplet, removeUserOtherLockedTriplets } =
    usePendingTriplets();

  const [currentReleaseRequestValue, setCurrentReleaseRequestValue] =
    useState<TReleaseRequestValue | null>(null);

  const {
    presence: { user },
  } = useSelf();

  const releaseRequests = useStorage((root) => root.releaseRequests);
  const answeredRequest = useStorage((root) => root.answeredRequests);

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

  const releaseRequestOfCurrentUser = useMemo(() => {
    if (!user) return;

    const releaseRequest = Object.values(releaseRequests).find(
      (request) => request.requestedBy.id === user.id
    );

    return releaseRequest;
  }, [releaseRequests, user]);

  const requestRelease = useMutation(
    ({ storage, self }, tripletId: string, message: string) => {
      const currentTriplet = storage.get("lockedTriplets").get(tripletId);

      if (!currentTriplet) {
        toast.error("Triplet not found");
        return;
      }

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
          tripletId,
          message,
        })
      );

      toast.loading(`Request sent`, {
        description: <RequestSentToast currentTriplet={currentTriplet} />,
        richColors: false,
        id: `request_${tripletId}`,
        closeButton: false,
        action: {
          label: "Cancel",
          onClick: (e) => {
            e.preventDefault();
            cancelYourOwnReleaseRequest(tripletId);
          },
          actionButtonStyle: {
            display: "block",
            opacity: 1,
            pointerEvents: "all",
          },
        },
        actionButtonStyle: {
          display: "block",
          opacity: 1,
          pointerEvents: "all",
        },
      });

      setTimeout(() => {
        acceptYourOwnReleaseRequestIfOwnerIsOffline(tripletId);
      }, RELEASE_TIMEOUT);
    },
    []
  );

  const cancelYourOwnReleaseRequest = useMutation(
    (
      {
        storage,
        self: {
          presence: { user },
        },
      },
      tripletId: string
    ) => {
      if (!user) {
        toast.error("You must be logged in to cancel a release request");
        return;
      }

      const releaseRequest = storage.get("releaseRequests").get(tripletId);

      if (!releaseRequest) {
        // toast.error("No release request for this triplet");
        return;
      }

      const isMyOwnRequest = releaseRequest.get("requestedBy").id === user.id;

      if (!isMyOwnRequest) {
        toast.error("You are not the owner of this release request");
        return;
      }

      storage.get("releaseRequests").delete(tripletId);

      toast.info("Canceled", {
        description: "",
        richColors: false,
        id: `request_${tripletId}`,
        duration: 3000,
        action: {
          label: "",
          onClick: () => {},
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
      });
    },
    []
  );

  const acceptYourOwnReleaseRequestIfOwnerIsOffline = useMutation(
    ({ storage, others, self }, tripletId: string) => {
      const {
        presence: { user },
      } = self;

      if (!user) {
        toast.error("You must be logged in to accept a release request");
        return;
      }

      const currentRequestedTriplet = storage
        .get("lockedTriplets")
        .get(tripletId);

      if (!currentRequestedTriplet) {
        toast.error("Triplet not found");
        return;
      }

      const requestedTripletOwner = currentRequestedTriplet.get("lockedBy");

      const isOwnerOffline = others.every(
        (other) => other.presence.user?.id !== requestedTripletOwner.id
      );

      if (!isOwnerOffline) {
        return;
      }

      const releaseRequest = storage.get("releaseRequests").get(tripletId);

      if (!releaseRequest) {
        // toast.error("No release request for this triplet");
        return;
      }

      storage.get("lockedTriplets").get(tripletId).set("lockedBy", user);

      storage.get("answeredRequests").set(
        tripletId,
        new LiveObject({
          requestedBy: user,
          tripletId,
          actionTakenBy: requestedTripletOwner,
          action: "accepted",
          wasOwnerOffline: true,
        })
      );

      storage.get("releaseRequests").delete(tripletId);
    },
    []
  );

  const acceptOthersReleaseRequest = useMutation(
    async (
      { storage, self },
      tripletId: string,
      dueToInActivity: boolean = false
    ) => {
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

      // remove the other triplets that are locked by the request owner
      removeUserOtherLockedTriplets(tripletId, receivingUser.id);

      toast.success("Triplet moved successfully", {
        id: `request_${tripletId}`,
        actionButtonStyle: {
          display: "none",
        },
      });

      storage.get("answeredRequests").set(
        tripletId,
        new LiveObject({
          requestedBy: receivingUser,
          tripletId,
          actionTakenBy: user,
          action: "accepted",
          wasOwnerOffline: dueToInActivity,
        })
      );
    },
    [getSingleTriplet, removeUserOtherLockedTriplets]
  );

  const dismissOthersReleaseRequest = useMutation(
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

      storage.get("answeredRequests").set(
        tripletId,
        new LiveObject({
          requestedBy: storage
            .get("releaseRequests")
            .get(tripletId)
            .get("requestedBy"),
          tripletId,
          actionTakenBy: user,
          action: "rejected",
          wasOwnerOffline: false,
        })
      );

      storage.get("releaseRequests").delete(tripletId);

      toast.warning("Release request dismissed", {
        richColors: true,
        id: `request_${currentTriplet.get("triplet")._id}`,
        actionButtonStyle: {
          display: "none",
        },
        duration: 3000,
        onDismiss() {
          return;
        },
      });
    },
    []
  );

  const doesTheGivenTripletHaveAReleaseRequest = useCallback(
    (tripletId: string) => {
      return !!releaseRequests[tripletId];
    },
    [releaseRequests]
  );

  const flushReleaseRequest = useMutation(
    ({ storage }) => {
      storage.set("releaseRequests", new LiveObject({}));
    },
    [currentTriplet]
  );

  // useEffect(() => {
  //   flushReleaseRequest();
  // }, []);

  useEffect(() => {
    if (!currentTriplet) return;

    if (!releaseRequestOfCurrentTriplet) return;

    const releaseRequestTimeout = setTimeout(() => {
      toast.warning("Release request has expired", {
        description: "Triplet has been skipped due to inactivity",
        id: `release_${currentTriplet._id}`,
        richColors: true,
        duration: 3000,
        actionButtonStyle: {
          display: "none",
        },
        onDismiss() {
          return;
        },
      });
      acceptOthersReleaseRequest(currentTriplet._id, true);
    }, RELEASE_TIMEOUT);

    toast.info(
      `Release request from ${releaseRequestOfCurrentTriplet.requestedBy.username}`,
      {
        description: (
          <ReleaseRequestToast
            releaseRequestOfCurrentTriplet={releaseRequestOfCurrentTriplet}
          />
        ),
        id: `release_${currentTriplet._id}`,
        duration: RELEASE_TIMEOUT,
        position: "bottom-right",
        action: {
          label: "Accept",
          onClick: () => {
            clearTimeout(releaseRequestTimeout);
            acceptOthersReleaseRequest(currentTriplet._id);
          },
        },
        actionButtonStyle: {
          display: "block",
        },
        onDismiss: () => {
          clearTimeout(releaseRequestTimeout);
          dismissOthersReleaseRequest(currentTriplet._id);
          return;
        },
      }
    );

    setCurrentReleaseRequestValue(releaseRequestOfCurrentTriplet);

    return () => clearTimeout(releaseRequestTimeout);
  }, [
    currentTriplet,
    releaseRequestOfCurrentTriplet,
    dismissOthersReleaseRequest,
  ]);

  useEffect(() => {
    if (!currentReleaseRequestValue) {
      return;
    }
    if (releaseRequestOfCurrentTriplet) {
      return;
    }

    if (answeredRequest[currentReleaseRequestValue.tripletId]) {
      setCurrentReleaseRequestValue(null);
      return;
    }

    toast.warning("Release request has been canceled", {
      description: (
        <>
          <Badge variant={"outline"} className="rounded-md">
            {currentReleaseRequestValue.requestedBy.username}
          </Badge>{" "}
          has canceled the request.
        </>
      ),
      richColors: true,
      id: `release_${currentReleaseRequestValue.tripletId}`,
      actionButtonStyle: {
        display: "none",
      },
      duration: 3000,
      onDismiss() {
        return;
      },
    });

    setCurrentReleaseRequestValue(null);
  }, [
    currentReleaseRequestValue,
    answeredRequest,
    releaseRequestOfCurrentTriplet,
  ]);

  return {
    requestRelease,
    acceptReleaseRequest: acceptOthersReleaseRequest,
    dismissReleaseRequest: dismissOthersReleaseRequest,
    removeUserOtherLockedTriplets,
    doesTheGivenTripletHaveAReleaseRequest,
    flushReleaseRequest,
    currentTripletHasAReleaseRequest: !!releaseRequestOfCurrentTriplet,
    currentUserHasAReleaseRequest: !!releaseRequestOfCurrentUser,
  };
};
