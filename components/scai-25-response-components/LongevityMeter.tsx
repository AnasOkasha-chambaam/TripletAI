// components/ai-perfume/LongevityMeter.tsx
export function LongevityMeter({ concentration }: { concentration: string }) {
  const levels = {
    "Eau de Cologne": { width: "40%", label: "Light (4-6 hours)" },
    "Eau de Toilette": { width: "60%", label: "Moderate (6-8 hours)" },
    "Eau de Parfum": { width: "80%", label: "Long-lasting (8-10 hours)" },
    Parfum: { width: "95%", label: "Intense (10+ hours)" },
  };

  const { width, label } = levels[concentration as keyof typeof levels] || {
    width: "50%",
    label: "Moderate",
  };

  return (
    <div className="space-y-2">
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width }}
        />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
