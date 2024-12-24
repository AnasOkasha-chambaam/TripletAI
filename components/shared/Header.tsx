import { Navbar } from "./Navbar";

interface HeaderProps {
  title?: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Navbar />
      {(title || description) && (
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          {title && (
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-1 text-sm sm:text-base text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
    </header>
  );
}
