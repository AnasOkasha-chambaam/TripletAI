// components/ai-perfume/AccordionTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainAccordsCard } from "./MainAccordsCard";
import { PerfumeNotesCard } from "./PerfumeNotesCard";
import { PerfumersList } from "./PerfumersList";
import { CollectionGallery } from "./CollectionGallery";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AccordionTabs({ perfume }: { perfume: any }) {
  return (
    <Tabs defaultValue="notes">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="accords">Accords</TabsTrigger>
        <TabsTrigger value="perfumers">Perfumers</TabsTrigger>
        <TabsTrigger value="collection">Collection</TabsTrigger>
      </TabsList>

      <TabsContent value="notes">
        <PerfumeNotesCard notes={perfume.notes} />
      </TabsContent>

      <TabsContent value="accords">
        <MainAccordsCard
          // name={(perfume as any).name as string}
          mainAccords={perfume.mainAccords}
        />
      </TabsContent>

      <TabsContent value="perfumers">
        <PerfumersList perfumers={perfume.perfumers} />
      </TabsContent>

      <TabsContent value="collection">
        <CollectionGallery
          name={perfume.name}
          collection={perfume.collectionsPerfume}
        />
      </TabsContent>
    </Tabs>
  );
}
