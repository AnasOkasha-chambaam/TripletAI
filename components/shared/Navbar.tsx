// /components/shared/Navbar.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ui/theme-toggle";
import Logo from "./Logo";
import { MenuIcon } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  //   { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 inset-x-0 bg-transparent backdrop-blur-lg shadow-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                {/* TripletAI */}
                {/* <Image
                  src="/logo.svg"
                  alt="TripletAI"
                  width={48}
                  height={48}
                  className="size-12"
                /> */}
                <Logo className="size-12" fill="hsla(var(--primary))" />
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
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-muted-foreground/70",
                      {
                        "border-primary/50 text-foreground/90 font-semibold":
                          pathname === item.href,
                      }
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Separator orientation="vertical" className="h-9 max-h-full" />
                <ThemeToggle />
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <SignInButton />
                <Separator orientation="vertical" className="h-9 max-h-full" />
                <ThemeToggle />
              </div>
            </SignedOut>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            {/* TODO: Create a side sheet for the menu. */}
            <ThemeToggle />
            <Separator orientation="vertical" className="h-9 max-h-full" />
          </div>
        </div>
      </div>
    </nav>
  );
}
