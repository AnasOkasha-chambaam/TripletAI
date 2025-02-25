import React from "react";
import { Badge } from "../ui/badge";

const LimitedEditionBadge = ({
  year,
  collection,
}: {
  year?: string | null;
  collection: string;
}) => {
  return (
    <Badge variant="secondary">{`${year} ${collection} Limited Edition`}</Badge>
  );
};

export default LimitedEditionBadge;
