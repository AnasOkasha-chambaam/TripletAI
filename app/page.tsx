// /app/page.tsx

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, ChevronRight, Layers, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">TripletAI</h1>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <>
              <Link href="/dashboard" passHref>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Separator
                orientation="vertical"
                color="red"
                className="h-9 max-h-full"
              />
              <UserButton />
            </>
          </SignedIn>
        </div>
      </header> */}

      <div className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-primary mb-4">
            Streamline Your AI Training Data
          </h2>
          <p className="text-xl text-foreground/40 mb-8 max-w-2xl mx-auto">
            Efficiently manage and curate your supervised learning triplets with
            our intuitive platform.
          </p>
          <Link href="/dashboard" passHref>
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started <ChevronRight className="ml-2" />
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <BarChart className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>Efficient Management</CardTitle>
              <CardDescription>
                {/* Streamline your AI model training process with our efficient data management tools. */}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Easily organize and categorize your supervised learning triplets
                with our intuitive interface.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Layers className="h-10 w-10 text-green-500 mb-2" />
              <CardTitle>Smart Categorization</CardTitle>
              <CardDescription>
                {/* Swipe-based interactions for quick and easy classification of your AI training data. */}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Swipe-based interactions for quick and easy classification of
                your AI training data.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-yellow-500 mb-2" />
              <CardTitle>Rapid Iteration</CardTitle>
              <CardDescription>
                {/* Export your curated data for AI model training with just a few clicks. */}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Streamline your AI model training process with our efficient
                data management tools.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-card text-card-foreground rounded-lg p-8 mb-16">
          <h3 className="text-3xl font-bold text-primary mb-4">How It Works</h3>
          <ol className="list-decimal list-inside space-y-4 text-card-foreground/60">
            <li>Sign in with your authorized email</li>
            <li>Review pending triplets with our intuitive swipe interface</li>
            <li>Easily edit and manage accepted and rejected triplets</li>
            <li>Export your curated data for AI model training</li>
          </ol>
        </section>

        <section className="text-center">
          <h3 className="text-3xl font-bold text-primary mb-4">
            Ready to Optimize Your AI Training Data?
          </h3>
          <p className="text-xl text-foreground/40 mb-8 max-w-2xl mx-auto">
            Join the growing community of AI researchers and developers using
            TripletAI to streamline their workflow.
          </p>
          <Link href="/dashboard" passHref>
            <Button size="lg" className="text-lg px-8 py-6">
              Start Curating Now <ChevronRight className="ml-2" />
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
