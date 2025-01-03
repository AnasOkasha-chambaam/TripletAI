"use client";

import { useFilteringTriplets } from "@/components/hooks/useFilteringTriplets";
import { Button } from "@/components/ui/button";
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
import { exportAllAcceptedTriplets } from "@/lib/actions/triplet.actions";
import { cn } from "@/lib/utils";
import { BracesIcon, SheetIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { LoaderOfFilteringTriplets } from "./LoaderOfFilteringTriplets";
import { SearchInput } from "./SearchInput";
import { ShowSelectedTripletsModal } from "./ShowSelectedTriplets";
import { TripletGrid } from "./TripletGrid";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";

export default function AcceptedTriplets() {
  const [selectedTriplets, setSelectedTriplets] = useState<Set<string>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");

  const { triplets, loading, error, totalPages, totalItems } =
    useFilteringTriplets({
      status: "accepted",
      page: currentPage,
      sortBy,
      sortOrder,
      searchQuery,
    });

  const handleSelectAll = () => {
    if (selectedTriplets.size === triplets.length) {
      setSelectedTriplets(new Set());
    } else {
      setSelectedTriplets(
        new Set([...selectedTriplets, ...triplets.map((t) => t._id)])
      );
    }
  };

  const handleDeselectAll = () => {
    setSelectedTriplets(new Set());
  };

  const handleSelect = (id: string) => {
    setSelectedTriplets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleExportAll = useCallback(async (format: "json" | "csv") => {
    try {
      const result = await exportAllAcceptedTriplets(format);
      if (result.success && result.data) {
        const blob = new Blob([result.data], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `all_triplets.${format}`;
        link.href = url;
        link.click();
        toast.success(
          `All triplets exported as ${format.toUpperCase()} successfully`
        );
      } else {
        console.error("Export failed:", result.error);
        toast.error(`Export failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("An unexpected error occurred during export");
    }
  }, []);

  const paginationNumbers = useMemo(() => {
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    return Array.from(
      { length: end - start + 1, 0: { any: 1 }, 1: { any: 1 }, 2: { any: 1 } },
      ({}, i) => start + i
    );
  }, [currentPage, totalPages]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center flex-wrap gap-2">
        <div>
          <Button
            onClick={handleSelectAll}
            disabled={!triplets.length}
            className="mr-2"
          >
            {selectedTriplets.size === triplets.length && triplets.length > 0
              ? "Deselect All on Page"
              : "Select All on Page"}
          </Button>
          <Button
            onClick={handleDeselectAll}
            disabled={selectedTriplets.size === 0}
            variant="outline"
          >
            Deselect All
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleExportAll("json")} variant={"outline"}>
            <BracesIcon className="mr-2" />
            Export All JSON
          </Button>
          <Button onClick={() => handleExportAll("csv")} variant={"outline"}>
            <SheetIcon className="mr-2" />
            Export All CSV
          </Button>
        </div>
      </div>
      <div className="mb-4 space-y-4">
        <div className="flex justify-between items-center max-sm:flex-col max-sm:items-center gap-2">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search accepted triplets..."
            className="w-80"
          />
          <Badge variant="secondary" className="text-sm">
            Selected: {selectedTriplets.size} / {totalItems}
          </Badge>
        </div>

        <ShowSelectedTripletsModal
          selectedTriplets={selectedTriplets}
          onDeselect={handleSelect}
        />

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
      </div>
      {loading ? (
        <LoaderOfFilteringTriplets />
      ) : (
        <TripletGrid
          triplets={triplets}
          onSelect={handleSelect}
          selectedTriplets={selectedTriplets}
        />
      )}
    </div>
  );
}
