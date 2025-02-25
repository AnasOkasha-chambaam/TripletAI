import Image from "next/image";

export function BrandInfo({
  brand: { name, logo },
}: {
  brand: {
    name: string;
    logo: string;
  };
}) {
  return (
    name &&
    logo && (
      <div className="flex items-center mb-6 p-4 bg-muted rounded-lg">
        <Image
          src={logo}
          alt={name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <h2 className="text-2xl font-medium ml-4">{name}</h2>
      </div>
    )
  );
}
