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
import { AlertCircle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full bg-card max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl font-bold text-destructive">
              Unauthorized Access
            </CardTitle>
          </div>
          <CardDescription>
            You do not have permission to access this application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/40 mb-4">
            If you believe this is an error, please contact the administrator or
            try signing in with a different account.
          </p>
          <div className="space-y-4">
            <SignOutButton>
              <Button variant="outline" className="w-full">
                Sign Out
              </Button>
            </SignOutButton>
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
