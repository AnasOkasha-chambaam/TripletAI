"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Triplet {
  _id: string;
  input: string;
  output: string;
  explanation: string;
}

export default function AcceptedTriplets() {
  const [triplets, setTriplets] = useState<Triplet[]>([]);
  const [selectedTriplets, setSelectedTriplets] = useState<string[]>([]);

  useEffect(() => {
    fetchAcceptedTriplets();
  }, []);

  const fetchAcceptedTriplets = async () => {
    const response = await fetch("/api/triplets?status=accepted");
    const data = await response.json();
    setTriplets(data);
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
      const headers = ["input", "output", "explanation"];
      const csvContent = [
        headers.join(","),
        ...selectedData.map((t) =>
          headers.map((h) => t[h as keyof Triplet]).join(",")
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

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Button onClick={handleSelectAll}>
          {selectedTriplets.length === triplets.length
            ? "Deselect All"
            : "Select All"}
        </Button>
        <div>
          <Button onClick={() => handleExport("json")} className="mr-2">
            Export JSON
          </Button>
          <Button onClick={() => handleExport("csv")}>Export CSV</Button>
        </div>
      </div>
      {triplets.map((triplet) => (
        <Card key={triplet._id} className="mb-4">
          <CardContent className="p-4 flex items-center">
            <Checkbox
              id={triplet._id}
              checked={selectedTriplets.includes(triplet._id)}
              onCheckedChange={() => handleSelect(triplet._id)}
              className="mr-4"
            />
            <div>
              <h3 className="font-bold">Input: {triplet.input}</h3>
              <p>Output: {triplet.output}</p>
              <p>Explanation: {triplet.explanation}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
