import { useState, useEffect } from "react";

interface UseTripletProps {
  status: "accepted" | "rejected";
  page: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export function useFilteringTriplets({
  status,
  page,
  sortBy,
  sortOrder,
}: UseTripletProps) {
  const [triplets, setTriplets] = useState<TTriplet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTriplets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/triplets?status=${status}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`
        );
        if (!response.ok) throw new Error("Failed to fetch triplets");
        const data = await response.json();
        setTriplets(data.triplets);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError("An error occurred while fetching triplets");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTriplets();
  }, [status, page, sortBy, sortOrder]);

  return { triplets, loading, error, totalPages };
}
