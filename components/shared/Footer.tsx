// /components/shared/Footer.tsx

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {/* <Link
            href="/privacy"
            className="text-muted-foreground hover:text-muted-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-muted-foreground"
          >
            Terms of Service
          </Link> */}
          <a
            href="mailto:anasokashachama@gmail.com"
            className="text-muted-foreground hover:text-muted-foreground"
          >
            Contact
          </a>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-muted-foreground">
            &copy; {new Date().getFullYear()} TripletAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
