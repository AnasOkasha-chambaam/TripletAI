// /components/shared/Header.tsx

import { Navbar } from "./Navbar";

interface HeaderProps {
  title?: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header>
      <Navbar />
      {(title || description) && (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {title && (
            <h1 className="text-3xl font-bold text-foreground/90">{title}</h1>
          )}

          {description && (
            <p className="mt-1 text-sm text-foreground/40">{description}</p>
          )}
        </div>
      )}
    </header>
  );
}
