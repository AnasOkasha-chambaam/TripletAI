"use client";

import { useEffect, useState } from "react";
import SingleTripletCard from "@/components/shared/SingleTripletCard";
import { AddOrEditTripletDialog } from "./AddOrEditTripletDialog";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "./ui/label";

export default function RejectedTriplets() {
  const [triplets, setTriplets] = useState<TTriplet[]>([]);
  const [editingTriplet, setEditingTriplet] = useState<TTriplet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchRejectedTriplets();
  }, [currentPage, sortBy, sortOrder]);

  const fetchRejectedTriplets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/triplets?status=rejected&page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`
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

  const handleEditAndAccept = (triplet: TTriplet) => {
    setEditingTriplet(triplet);
  };

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex items-end justify-between space-x-2 p-2">
        <div className="flex items-center space-x-2">
          <div className="">
            <Label htmlFor="sortBy">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created At</SelectItem>
                <SelectItem value="input">Input</SelectItem>
                <SelectItem value="output">Output</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Label htmlFor="sortOrder">Order</Label>
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          triplets.map((triplet) => (
            <SingleTripletCard
              key={triplet._id}
              triplet={triplet}
              onEdit={() => handleEditAndAccept(triplet)}
            />
          ))
        )}
      </div>
      <div className="mt-4 flex justify-center items-center space-x-2">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="mr-2" />
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRightIcon className="ml-2" />
        </Button>
      </div>
      {editingTriplet && (
        <AddOrEditTripletDialog
          openExternal={!!editingTriplet}
          setOpenExternal={() => setEditingTriplet(null)}
          triplet={editingTriplet}
          successCallback={() => {
            setEditingTriplet(null);
            fetchRejectedTriplets();
          }}
        />
      )}
    </div>
  );
}
