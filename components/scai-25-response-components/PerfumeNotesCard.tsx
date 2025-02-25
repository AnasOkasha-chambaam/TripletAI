import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import type React from "react";

type TNote = {
  id: string;
  name: string;
  avatar: string;
};

const NoteItem = ({
  note,
}: {
  note: {
    avatar: string;
    name: string;
  };
  //   note: TPerfumePopulated["notes"]["top" | "middle" | "base"][number];
}) => (
  <div className="flex flex-col items-center mx-2">
    <Image
      src={note.avatar || "/placeholder.svg"}
      alt={note.name}
      width={40}
      height={40}
      className="rounded-full border-2 shadow-md"
    />
    <span className="text-xs mt-1 text-center">{note.name}</span>
  </div>
);

const NoteSection = ({
  title,
  icon: Icon,
  notes,
}: {
  title: string;
  icon?: React.ElementType;
  notes: TNote[];
}) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      <h3 className="text-lg font-semibold bg-secondary text-secondary-foreground p-2 w-full">
        {title}
      </h3>
    </div>
    <div className="flex flex-wrap justify-center">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  </div>
);

export function PerfumeNotesCard({
  notes,
}: {
  notes: {
    top: TNote[];
    middle: TNote[];
    base: TNote[];
  };
}) {
  return (
    <CardContent className="p-6">
      <div className="space-y-6">
        <NoteSection title="Top Notes" notes={notes.top} />
        <NoteSection title="Middle Notes" notes={notes.middle} />
        <NoteSection title="Base Notes" notes={notes.base} />
      </div>
    </CardContent>
  );
}
