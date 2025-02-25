// components/ResponseRenderer.tsx
import {
  AccordDescriptors,
  AccordionTabs,
  AIPerfumeResponse,
  BrandInfo,
  CollectionGallery,
  CollectionTimeline,
  CopyAsJSONButton,
  DecadeBadge,
  FragranceFamilyChip,
  GenderBadge,
  IngredientCarousel,
  LongevityMeter,
  MainAccordsCard,
  MainAccordsChart,
  NotePyramid,
  NotePyramidPreview,
  NoteTimeline,
  PerfumeImageCard,
  PerfumeMainDetails,
  PerfumeNotesCard,
  PerfumerCard,
  PerfumersList,
  ScentMatchesGrid,
  SeasonHeatmap,
  StyleDescriptors,
} from "../";

// Simple text component for markdown formatting
const TextContent = ({ children }: { children: string }) => (
  <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>
);

const componentsMap = {
  AccordDescriptors,
  AccordionTabs,
  AIPerfumeResponse,
  BrandInfo,
  CollectionGallery,
  CollectionTimeline,
  CopyAsJSONButton,
  DecadeBadge,
  FragranceFamilyChip,
  GenderBadge,
  IngredientCarousel,
  LongevityMeter,
  MainAccordsCard,
  MainAccordsChart,
  NotePyramid,
  NotePyramidPreview,
  NoteTimeline,
  PerfumeImageCard,
  PerfumeMainDetails,
  PerfumeNotesCard,
  PerfumerCard,
  PerfumersList,
  ScentMatchesGrid,
  SeasonHeatmap,
  StyleDescriptors,
};

export function ResponseRenderer({ response }: { response: TResponsePart[] }) {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {response.map((part, index) => {
        if (part.type === "text") {
          return <TextContent key={index}>{part.content}</TextContent>;
        }

        const Component =
          componentsMap[part.name as keyof typeof componentsMap];

        if (!Component) {
          console.warn(`Unknown component: ${part.name}`);
          return null;
        }

        return (
          <div key={index} className="my-6">
            <Component {...part.data} />
          </div>
        );
      })}
    </div>
  );
}
