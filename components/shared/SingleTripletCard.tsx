import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";

interface TripletCardProps {
  triplet: TTriplet;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
}

const SingleTripletCard: React.FC<TripletCardProps> = ({
  triplet,
  isSelected,
  onSelect,
  onEdit,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <div className="flex flex-row items-center justify-between">
        <CardHeader>
          <CardTitle className="text-primary">Single Triplet</CardTitle>
          <CardDescription>
            {triplet.status === "accepted"
              ? "Select to export"
              : triplet.status === "rejected"
              ? "Edit and accept"
              : "Swipe to take an action"}
          </CardDescription>
        </CardHeader>
        {(onSelect || onEdit) && (
          <Separator orientation="vertical" className="h-14" />
        )}
        {onSelect && (
          <Checkbox
            id={triplet._id}
            checked={isSelected}
            onCheckedChange={onSelect}
            className="mx-7 scale-150"
          />
        )}
        {onEdit && (
          <Button onClick={onEdit} className="mx-4">
            <EditIcon /> Edit
          </Button>
        )}
      </div>
      <Separator />
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground/40">{triplet.instruction}</p>
          {triplet.input && triplet.input.length > 0 ? (
            <h3 className="mb-4 text-2xl font-bold">{triplet.input}</h3>
          ) : (
            <h3 className="mb-4 text-xl font-bold opacity-25">Empty</h3>
          )}
          <p className="mb-4 p-2 pl-5 bg-muted/15 border-l-4">
            {triplet.output}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SingleTripletCard;
