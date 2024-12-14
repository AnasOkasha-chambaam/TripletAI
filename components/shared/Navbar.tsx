"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "../ui/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  //   { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-card shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                TripletAI
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <SignedIn>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      pathname === item.href
                        ? "border-primary/50 text-foreground/90"
                        : "border-transparent text-foreground/40 hover:border-foreground/30 hover:text-foreground/70"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Separator
                  orientation="vertical"
                  color="red"
                  className="h-9 max-h-full"
                />
                <ThemeToggle />
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
          <div className="flex items-center sm:hidden">
            {/* TODO: Create a side sheet for the menu. */}
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
