// /components/EmptyStateCard.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { ImportTripletsDialog } from "./ImportTripletsDialog";
import { InfoIcon } from "lucide-react";

const EmptyStateCard: React.FC<{
  importSuccessCallback: () => void;
}> = ({ importSuccessCallback }) => {
  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <InfoIcon className="mr-2" />
          No Pending Triplets
        </CardTitle>
        <CardDescription>
          You have no pending triplets at the moments
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mx-auto w-min">
          <ImportTripletsDialog successCallback={importSuccessCallback} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;
