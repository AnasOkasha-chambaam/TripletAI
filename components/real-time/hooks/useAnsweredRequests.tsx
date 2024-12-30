import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { useEffect } from "react";
import { toast } from "sonner";

const RequestAcceptedOfflineToast = ({ user }: { user: TLockedBy }) => (
  <div className="flex flex-col-reverse bg-card p-2 gap-2">
    <div className="flex items-center gap-1">
      <Avatar className="size-5">
        <AvatarImage src={user.picture} alt={user.username} />
        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>{" "}
      <Badge variant={"outline"} className="items-center rounded-md">
        {user.username}
      </Badge>{" "}
      is offline.
    </div>
    <p>You can now view the triplet.</p>
  </div>
);

const RequestAcceptedToast = ({ user }: { user: TLockedBy }) => (
  <div className="flex flex-col bg-card p-2 gap-2">
    <div className="flex items-center gap-1">
      <Avatar className="size-5">
        <AvatarImage src={user.picture} alt={user.username} />
        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>{" "}
      <Badge variant={"outline"} className="items-center rounded-md">
        {user.username}
      </Badge>
    </div>
    released the triplet for you.
  </div>
);

const RequestDismissedToast = ({ user }: { user: TLockedBy }) => (
  <div className="flex items-center bg-card p-2 gap-2">
    <div className="flex items-center gap-1">
      <Avatar className="size-5">
        <AvatarImage src={user.picture} alt={user.username} />
        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>{" "}
      <Badge variant={"outline"} className="items-center rounded-md">
        {user.username}
      </Badge>
    </div>
    dismissed the request.
  </div>
);

const useAnsweredRequests = () => {
  const answeredRequests = useStorage((root) => root.answeredRequests);

  const handleIfCurrentUserHasAnAnsweredRequest = useMutation(
    ({ storage, self }) => {
      const {
        presence: { user },
      } = self;

      if (!user) {
        return false;
      }

      const currentUserAnsweredRequest = Object.values(
        storage.get("answeredRequests").toObject()
      ).find(
        (answeredRequest) => answeredRequest.get("requestedBy").id === user.id
      );

      if (!currentUserAnsweredRequest) {
        return false;
      }

      const toastVariant =
        currentUserAnsweredRequest.get("action") === "accepted"
          ? "success"
          : "info";
      if (toastVariant === "success") {
        toast[toastVariant]("Accepted", {
          description() {
            return currentUserAnsweredRequest.get("wasOwnerOffline") ? (
              <RequestAcceptedOfflineToast
                user={currentUserAnsweredRequest.get("actionTakenBy")}
              />
            ) : (
              <RequestAcceptedToast
                user={currentUserAnsweredRequest.get("actionTakenBy")}
              />
            );
          },
          id: `request_${currentUserAnsweredRequest.get("tripletId")}`,
          richColors: true,
          actionButtonStyle: {
            display: "none",
          },
        });

        // Clean up other triplets that may be locked by the same user
        const lockedTriplets = storage.get("lockedTriplets").toObject();

        Object.values(lockedTriplets).forEach((lockedTriplet) => {
          if (
            lockedTriplet.get("lockedBy").id === user.id &&
            lockedTriplet.get("triplet").id !==
              currentUserAnsweredRequest.get("tripletId")
          ) {
            storage
              .get("lockedTriplets")
              .delete(lockedTriplet.get("triplet")._id);
          }
        });
      } else {
        toast[toastVariant]("Rejected", {
          description: (
            <RequestDismissedToast
              user={currentUserAnsweredRequest.get("actionTakenBy")}
            />
          ),
          id: `request_${currentUserAnsweredRequest.get("tripletId")}`,
          richColors: true,
          actionButtonStyle: {
            display: "none",
          },
        });
      }

      storage
        .get("answeredRequests")
        .delete(currentUserAnsweredRequest.get("tripletId"));
    },
    []
  );

  useEffect(() => {
    handleIfCurrentUserHasAnAnsweredRequest();
  }, [handleIfCurrentUserHasAnAnsweredRequest, answeredRequests]);

  return {
    answeredRequests,
  };
};

export default useAnsweredRequests;
