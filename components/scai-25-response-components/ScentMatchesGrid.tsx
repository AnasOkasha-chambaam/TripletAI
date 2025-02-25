import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Perfume {
  name: string;
  brand: string;
}

interface ScentMatchesGridProps {
  matches: Perfume[];
  baseNote: string;
}

export function ScentMatchesGrid({ matches, baseNote }: ScentMatchesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {matches.map((perfume, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-sm">{perfume.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{perfume.brand}</p>
            <p className="text-sm text-muted-foreground">
              Base note: {baseNote}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
