import { Badge } from "@/components/ui/badge";
import { CopyAsJSONButton } from "./CopyAsJSONButton";

export function PerfumeMainDetails({
  name,
  gender,
  about,
  blockquote,
  perfumeData,
}: {
  name: string;
  gender: string;
  about: string;
  blockquote: string[];
  perfumeData: unknown;
}) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary">{name}</h1>

      <div className="flex flex-col items-start gap-2 mb-4">
        <Badge variant="secondary" className="mr-2">
          {gender}
        </Badge>
        <CopyAsJSONButton perfumeData={perfumeData} />
      </div>

      <p className="text-muted-foreground mb-6">{about}</p>

      <div className="space-y-2">
        {blockquote.map((quote, index) => (
          <blockquote
            key={index}
            className="border-l-4 border-primary/35 px-4 italic py-2 bg-muted text-muted-foreground"
          >
            {quote}
          </blockquote>
        ))}
      </div>
    </div>
  );
}
