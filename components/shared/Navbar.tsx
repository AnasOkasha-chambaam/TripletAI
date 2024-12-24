"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "../ui/theme-toggle";
import Logo from "./Logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "inline-flex items-center p-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 sm:border-b-2 border-transparent hover:border-muted transition-colors",
            {
              "text-foreground font-semibold border-border sm:border-b-2 max-sm:bg-muted rotated-max-md-bg-muted":
                pathname === item.href,
            }
          )}
          onClick={() => setIsMenuOpen(false)}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center">
          <Link href="/" className="flex-shrink-0">
            <Logo className="h-8 w-auto sm:h-10" fill="hsl(var(--primary))" />
          </Link>
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
          <SignedIn>
            <NavLinks />
            <Separator orientation="vertical" className="h-6" />
            <ThemeToggle />
            <UserButton />
          </SignedIn>
          <SignedOut>
            <NavLinks />
            <Separator orientation="vertical" className="h-6" />
            <ThemeToggle />
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Separator orientation="vertical" className="h-9" />
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex flex-col justify-between"
            >
              <div className="">
                <Link href="/" className="rounded-full p-4 w-fit flex mx-auto">
                  <Logo className="size-10" fill="hsl(var(--primary))" />
                </Link>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through TripletAI
                  </SheetDescription>
                </SheetHeader>
                <Separator className="mb-9 mt-1" />
                <div className="flex flex-col justify-between space-y-4">
                  <NavLinks />
                </div>
              </div>
              <SignedOut>
                <SheetFooter className="flex flex-col gap-2">
                  <>
                    <Separator />
                    <SignInButton>
                      <Button className="w-full">Sign In</Button>
                    </SignInButton>
                  </>
                </SheetFooter>
              </SignedOut>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
