// components/ai-perfume/PerfumerCard.tsx
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export function PerfumerCard({
  perfumer,
}: {
  perfumer: {
    name: string;
    avatar: string;
    url: string;
  };
}) {
  return (
    <div className="flex items-center p-4 bg-muted rounded-lg mt-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={perfumer.avatar} alt={perfumer.name} />
      </Avatar>
      <div className="ml-4">
        <h3 className="font-medium">{perfumer.name}</h3>
        <a
          href={perfumer.url}
          className="text-sm text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View profile
        </a>
      </div>
    </div>
  );
}
