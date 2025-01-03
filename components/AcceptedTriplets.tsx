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
import { cn } from "@/lib/utils";
import { BracesIcon, SheetIcon } from "lucide-react";
import { useMemo, useState } from "react";
import ExportModal from "./ExportModal";
import { LoaderOfFilteringTriplets } from "./LoaderOfFilteringTriplets";
import { TripletGrid } from "./TripletGrid";
import { Label } from "./ui/label";

export default function AcceptedTriplets() {
  const [selectedTriplets, setSelectedTriplets] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { triplets, loading, error, totalPages } = useFilteringTriplets({
    status: "accepted",
    page: currentPage,
    sortBy,
    sortOrder,
  });

  const handleSelectAll = () => {
    if (selectedTriplets.length === triplets.length) {
      setSelectedTriplets([]);
    } else {
      setSelectedTriplets(triplets.map((t) => t._id));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedTriplets((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExport = (format: "json" | "csv") => {
    const selectedData = triplets.filter((t) =>
      selectedTriplets.includes(t._id)
    );
    let content: string;
    let filename: string;

    if (format === "json") {
      content = JSON.stringify(selectedData, null, 2);
      filename = "accepted_triplets.json";
    } else {
      const headers = ["input", "output", "instruction"];
      const csvContent = [
        headers.join(","),
        ...selectedData.map((t) =>
          headers.map((h) => t[h as keyof TTriplet]).join(",")
        ),
      ].join("\n");
      content = csvContent;
      filename = "accepted_triplets.csv";
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
  };

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
      <div className="mb-6 flex justify-between items-center">
        <Button onClick={handleSelectAll}>
          {selectedTriplets.length === triplets.length
            ? "Deselect All"
            : "Select All"}
        </Button>

        <div className="hidden sm:block">
          <Button
            onClick={() => handleExport("json")}
            variant={"outline"}
            className="mr-2"
            disabled={!selectedTriplets.length}
          >
            <BracesIcon className="mr-2" />
            Export JSON
          </Button>
          <Button
            onClick={() => handleExport("csv")}
            variant={"outline"}
            disabled={!selectedTriplets.length}
          >
            <SheetIcon className="mr-2" />
            Export CSV
          </Button>
        </div>
        <ExportModal
          onExport={(format) => handleExport(format as "json" | "csv")}
          disabled={!selectedTriplets.length}
        />
      </div>
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
        <TripletGrid
          triplets={triplets}
          onSelect={handleSelect}
          selectedTriplets={selectedTriplets}
        />
      )}
    </div>
  );
}
