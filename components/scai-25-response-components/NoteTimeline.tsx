import { Clock } from "lucide-react";

interface Note {
  name: string;
}

interface NoteTimelineProps {
  note: { top: Note[]; middle: Note[]; base: Note[] };
}

export function NoteTimeline({
  note: { top, middle, base },
}: NoteTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="font-semibold">Top Notes:</span>
        <span>{top.map((note) => note.name).join(", ")}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="font-semibold">Middle Notes:</span>
        <span>{middle.map((note) => note.name).join(", ")}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="font-semibold">Base Notes:</span>
        <span>{base.map((note) => note.name).join(", ")}</span>
      </div>
    </div>
  );
}
