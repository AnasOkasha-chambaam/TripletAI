"use client";

import { useEffect, useState } from "react";
import SingleTripletCard from "@/components/shared/SingleTripletCard";
import { Button } from "@/components/ui/button";
import {
  BracesIcon,
  SheetIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import ExportModal from "./ExportModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AcceptedTriplets() {
  const [triplets, setTriplets] = useState<TTriplet[]>([]);
  const [selectedTriplets, setSelectedTriplets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchAcceptedTriplets();
  }, [currentPage, sortBy, sortOrder]);

  const fetchAcceptedTriplets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/triplets?status=accepted&page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`
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

  // if (loading) return <div>Loading...</div>;
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
              isSelected={selectedTriplets.includes(triplet._id)}
              onSelect={() => handleSelect(triplet._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
