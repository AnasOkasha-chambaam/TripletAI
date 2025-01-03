import { escapeRegExp } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "./useDebounce";

interface UseFilteringTripletsProps {
  status: "accepted" | "rejected";
  page: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  searchQuery: string;
}

export function useFilteringTriplets({
  status,
  page,
  sortBy,
  sortOrder,
  searchQuery,
}: UseFilteringTripletsProps) {
  const [triplets, setTriplets] = useState<TTriplet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const sanitizedSearchQuery = useMemo(
    () => escapeRegExp(debouncedSearchQuery),
    [debouncedSearchQuery]
  );

  useEffect(() => {
    const fetchTriplets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/triplets?status=${status}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${encodeURIComponent(
            sanitizedSearchQuery
          )}`
        );
        if (!response.ok) throw new Error("Failed to fetch triplets");
        const data = await response.json();
        setTriplets(data.triplets);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      } catch (err) {
        setError("An error occurred while fetching triplets");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTriplets();
  }, [status, page, sortBy, sortOrder, sanitizedSearchQuery]);

  return { triplets, loading, error, totalPages, totalItems };
}
