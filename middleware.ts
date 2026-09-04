import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Pages that require a Clerk session. Everything else is public at the edge.
//
// Per-user authorization (ALLOWED_EMAILS) deliberately does NOT live here any
// more: it now runs in lib/auth/current-user.ts, in the Node runtime, where it
// reads env at request time, already has the user's email without a Clerk API
// round trip, and can also guard Server Actions and route handlers — none of
// which middleware can reach.
const isProtectedPage = createRouteMatcher(["/dashboard(.*)"]);

// Clerk calls this itself; it authenticates via its own svix signature.
const isPublicApi = createRouteMatcher(["/api/webhooks/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicApi(req)) return;

  // Not adding /api/* here on purpose: auth.protect() returns notFound() (404)
  // rather than 401 for non-page requests. Those routes guard themselves with
  // requireApiUser() instead.
  if (isProtectedPage(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
