// components/ai-perfume/NotePyramidPreview.tsx
import { Card, CardContent } from "@/components/ui/card";

export function NotePyramidPreview({
  note,
}: {
  note: {
    top: { _id: string; name: string }[];
    middle: { _id: string; name: string }[];
    base: { _id: string; name: string }[];
  };
}) {
  return (
    <Card className="mt-4">
      <CardContent className="p-4 grid grid-cols-3 gap-4">
        <NoteColumn title="Top Notes" notes={note.top} />
        <NoteColumn title="Heart Notes" notes={note.middle} />
        <NoteColumn title="Base Notes" notes={note.base} />
      </CardContent>
    </Card>
  );
}

const NoteColumn = ({
  title,
  notes,
}: {
  title: string;
  notes: {
    _id: string;
    name: string;
  }[];
}) => (
  <div>
    <h3 className="text-sm font-medium mb-2">{title}</h3>
    <div className="space-y-1">
      {notes.slice(0, 3).map((note) => (
        <div key={note._id} className="text-sm text-muted-foreground">
          {note.name}
        </div>
      ))}
    </div>
  </div>
);
