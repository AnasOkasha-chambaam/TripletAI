import { Liveblocks } from "@liveblocks/node";

let client: Liveblocks | null = null;

/**
 * Lazily constructed, never at module scope.
 *
 * On Cloudflare Workers the environment is populated per request, so reading
 * process.env while the module is being evaluated yields undefined — the client
 * would be built with `secret: undefined` and every Liveblocks call would fail
 * with an opaque auth error, at runtime only, long after a green build.
 *
 * Memoising the instance is safe here even on Workers: the Liveblocks node
 * client talks over fetch() and holds no per-request I/O object, unlike the
 * Mongoose connection in ./dbConnect.ts.
 */
export function getLiveblocks(): Liveblocks {
  if (client) return client;

  const secret = process.env.LIVEBLOCKS_SECRET_KEY;

  // Previously cast away with `as string`, which turned a missing secret into a
  // confusing 401 from the Liveblocks API instead of a clear local failure.
  if (!secret) {
    throw new Error(
      "Please define the LIVEBLOCKS_SECRET_KEY environment variable"
    );
  }

  client = new Liveblocks({ secret });
  return client;
}
