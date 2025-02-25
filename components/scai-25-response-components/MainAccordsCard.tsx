// components/ai-perfume/MainAccordsCard.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MainAccordsChart } from "./MainAccords.chart";

/* 
{
  name: string;
  mainAccords: {
    accord: {
      name: string;
      color: string;
    };
    percent: number;
  }[];
  //   mainAccords: TPerfumePopulated["mainAccords"];
}
*/

export function MainAccordsCard({
  mainAccords,
}: {
  mainAccords: {
    accord: {
      name: string;
      color: string;
    };
    percent: number;
  }[];
}) {
  //   mainAccords: TPerfumePopulated["mainAccords"];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Main Accords</CardTitle>
        <CardDescription>
          Dominant scent characteristics
          {/* of{" "}
          <span className="font-bold underline">{name}</span> */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MainAccordsChart mainAccords={Object.values(mainAccords)} />
      </CardContent>
    </Card>
  );
}
