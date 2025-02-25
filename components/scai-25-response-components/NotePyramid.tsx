// components/ai-perfume/NotePyramid.tsx
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function NotePyramid({
  notes,
}: {
  notes: {
    top: { _id: string; name: string }[];
    middle: { _id: string; name: string }[];
    base: { _id: string; name: string }[];
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fragrance Pyramid</CardTitle>
      </CardHeader>
      <div className="p-6 space-y-8">
        <div>
          <h3 className="text-sm font-medium mb-4">Top Notes</h3>
          <div className="flex flex-wrap gap-2">
            {notes.top.map((note) => (
              <Badge variant="outline" key={note._id}>
                {note.name}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Heart Notes</h3>
          <div className="flex flex-wrap gap-2">
            {notes.middle.map((note) => (
              <Badge variant="outline" key={note._id}>
                {note.name}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Base Notes</h3>
          <div className="flex flex-wrap gap-2">
            {notes.base.map((note) => (
              <Badge variant="outline" key={note._id}>
                {note.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
