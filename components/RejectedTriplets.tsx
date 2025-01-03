"use client";

import { useFilteringTriplets } from "@/components/hooks/useFilteringTriplets";
import { LoaderOfFilteringTriplets } from "@/components/LoaderOfFilteringTriplets";
import { TripletGrid } from "@/components/TripletGrid";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { AddOrEditTripletDialog } from "./AddOrEditTripletDialog";
import { Label } from "./ui/label";

export default function RejectedTriplets() {
  const [editingTriplet, setEditingTriplet] = useState<TTriplet | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { triplets, loading, error, totalPages } = useFilteringTriplets({
    status: "rejected",
    page: currentPage,
    sortBy,
    sortOrder,
  });

  const handleEditAndAccept = (triplet: TTriplet) => {
    setEditingTriplet(triplet);
  };

  const paginationNumbers = useMemo(() => {
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    return Array.from(
      {
        length: end - start + 1,
        0: { any: 1 },
        1: { any: 1 },
        2: { any: 1 },
      },
      ({}, i) => start + i
    );
  }, [currentPage, totalPages]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex items-end justify-between space-x-2 p-2 max-lg:flex-col max-lg:items-center bg-card mb-1">
        <div className="flex items-center space-x-2">
          <div>
            <Label htmlFor="sortBy">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] max-sm:w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created At</SelectItem>
                <SelectItem value="input">Input</SelectItem>
                <SelectItem value="output">Output</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sortOrder">Order</Label>
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
            >
              <SelectTrigger className="w-[180px] max-sm:w-[130px]">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  // isActive={currentPage === 1}
                  className={cn(
                    "cursor-pointer [&>span]:hidden sm:[&>span]:inline max-sm:border max-sm:p-3",
                    {
                      "opacity-50 pointer-events-none": currentPage === 1,
                    }
                  )}
                />
              </PaginationItem>
              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {paginationNumbers.map((pageNumber) => (
                <PaginationItem key={"page-" + pageNumber}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={currentPage === pageNumber}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={cn(
                    "cursor-pointer [&>span]:hidden sm:[&>span]:inline max-sm:border max-sm:p-3",
                    {
                      "opacity-50 pointer-events-none":
                        currentPage >= totalPages,
                    }
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      {loading ? (
        <LoaderOfFilteringTriplets />
      ) : (
        <TripletGrid triplets={triplets} onEdit={handleEditAndAccept} />
      )}

      {editingTriplet && (
        <AddOrEditTripletDialog
          openExternal={!!editingTriplet}
          setOpenExternal={() => setEditingTriplet(null)}
          triplet={editingTriplet}
          successCallback={() => {
            setEditingTriplet(null);
          }}
        />
      )}
    </div>
  );
}
