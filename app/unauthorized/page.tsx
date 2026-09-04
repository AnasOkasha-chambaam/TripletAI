// /app/unauthorized/page.tsx

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ServerCrash } from "lucide-react";
import type { TAppUserFailure } from "@/lib/auth/current-user";

type TReasonCopy = {
  title: string;
  description: string;
  body: string;
  /** A transient failure isn't a permissions problem — don't offer "sign out". */
  isTransient?: boolean;
};

const REASON_COPY: Record<TAppUserFailure, TReasonCopy> = {
  unauthenticated: {
    title: "You're signed out",
    description: "You need to be signed in to view this page.",
    body: "Your session has ended or was never started. Sign in again from the home page to continue.",
  },
  "not-allowed": {
    title: "Unauthorized Access",
    description: "You do not have permission to access this application.",
    body: "Your account isn't on this application's allowlist. If you believe this is an error, please contact the administrator or try signing in with a different account.",
  },
  "no-email": {
    title: "No email address",
    description: "This account has no email address attached.",
    body: "This application identifies users by email, and your account doesn't have one. Add an email address to your account, or sign in with a different one.",
  },
  "email-taken": {
    title: "Email already in use",
    description: "Another account is already using this email address.",
    body: "We can only move existing data to a new account once the email address has been verified. Verify your email address, then sign in again.",
  },
  unavailable: {
    title: "Something went wrong",
    description: "We couldn't reach the database.",
    body: "This isn't a permissions problem — the service is temporarily unavailable. Please wait a moment and try again.",
    isTransient: true,
  },
};

const isKnownReason = (value?: string): value is TAppUserFailure =>
  value !== undefined && value in REASON_COPY;

export default async function UnauthorizedPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const copy = isKnownReason(reason)
    ? REASON_COPY[reason]
    : REASON_COPY["not-allowed"];

  const Icon = copy.isTransient ? ServerCrash : AlertCircle;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full bg-card max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Icon className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl font-bold text-destructive">
              {copy.title}
            </CardTitle>
          </div>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{copy.body}</p>
          <div className="space-y-4">
            {!copy.isTransient && (
              <SignOutButton>
                <Button variant="outline" className="w-full">
                  Sign Out
                </Button>
              </SignOutButton>
            )}
            <Link href="/" passHref>
              <Button variant="default" className="w-full mt-3">
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="mailto:anasokashachama@gmail.com"
              className="text-blue-500 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
