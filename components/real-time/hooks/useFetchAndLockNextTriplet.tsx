import usePendingTriplets from "@/components/real-time/hooks/usePendingTriplets";
import useSkippedTriplets from "@/components/real-time/hooks/useSkippedTriplets";
import {
  getNextTripletToLock,
  getTripletsCount,
} from "@/lib/actions/triplet.actions";
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";

const useFetchAndLockNextTriplet = () => {
  const {
    currentTriplet,
    lockTriplet,
    lockedTripletByOthersIds,
    setPendingTripletsCount,
  } = usePendingTriplets();
  const { skippedTripletIds } = useSkippedTriplets();
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [fetchCountsTrigger, setFetchCountsTrigger] = useState(false);

  const [
    getNextTripletActionState,
    getNextTripletAction,
    isGetNextTripletActionPending,
  ] = useActionState(getNextTripletToLock, {
    initial: true,
    nextTriplet: undefined,
    pendingTripletsCount: 0,
  });

  const [
    getTripletsCountActionState,
    getTripletsCountAction,
    isGetTripletsCountActionPending,
  ] = useActionState(getTripletsCount, {
    initial: true,
    pendingTripletsCount: 0,
    acceptedTripletsCount: 0,
    rejectedTripletsCount: 0,
  });

  useEffect(() => {
    if (getNextTripletActionState.initial) return;
    const { nextTriplet, pendingTripletsCount } = getNextTripletActionState;

    if (nextTriplet) {
      lockTriplet(nextTriplet, pendingTripletsCount);
    } else {
      setPendingTripletsCount(pendingTripletsCount);
    }
  }, [getNextTripletActionState, lockTriplet, setPendingTripletsCount]);

  useEffect(() => {
    if (getTripletsCountActionState.initial) return;

    const { pendingTripletsCount } = getTripletsCountActionState;

    setPendingTripletsCount(pendingTripletsCount);
  }, [getTripletsCountActionState, setPendingTripletsCount]);

  const fetchNextTriplet = useCallback(async () => {
    if (!currentTriplet) {
      startTransition(() => {
        getNextTripletAction([
          ...lockedTripletByOthersIds,
          ...skippedTripletIds,
        ]);
      });
    }
  }, [
    currentTriplet,
    lockedTripletByOthersIds,
    skippedTripletIds,
    lockTriplet,
  ]);

  useEffect(() => {
    fetchNextTriplet();
  }, [fetchTrigger, fetchNextTriplet]);

  useEffect(() => {
    startTransition(() => {
      getTripletsCountAction();
    });
  }, [fetchCountsTrigger, getTripletsCountAction]);

  const refreshNextTriplet = () => {
    setFetchTrigger((prev) => !prev);
  };

  const refreshTripletCounts = () => {
    setFetchCountsTrigger((prev) => !prev);
  };

  return {
    refreshNextTriplet,
    refreshTripletCounts,
    isGetNextTripletActionPending,
    isGetTripletsCountActionPending,
  };
};

export default useFetchAndLockNextTriplet;
