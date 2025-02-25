// Example usage in AI response
import { MainAccordsCard } from "./MainAccordsCard";

export function AIPerfumeResponse({
  perfume,
}: {
  perfume: {
    name: string;
    mainAccords: {
      accord: {
        name: string;
        color: string;
      };
      percent: number;
    }[];
  };
}) {
  return (
    <div className="space-y-4">
      <p>Here are the main accords for {perfume.name}:</p>
      <MainAccordsCard mainAccords={perfume.mainAccords} />
      <p className="text-sm text-muted-foreground">
        This chart shows the relative strength of each accord in the fragrance.
      </p>
    </div>
  );
}
