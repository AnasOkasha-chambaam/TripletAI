// /components/shared/Header.tsx

import { Navbar } from "./Navbar";

interface HeaderProps {
  title?: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <>
      <Navbar />
      <header>
        {(title || description || true) && (
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {title && (
              <h1 className="text-3xl font-bold text-muted-foreground">
                {title}
              </h1>
            )}

            {description && (
              <p className="mt-1 text-sm text-muted-foreground/70">
                {description}
              </p>
            )}
          </div>
        )}
      </header>
    </>
  );
}
