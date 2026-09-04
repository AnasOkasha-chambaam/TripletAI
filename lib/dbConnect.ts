// /lib/dbConnect.ts

import mongoose, { Mongoose } from "mongoose";

type TMongooseConnection = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

/**
 * Cloudflare Workers hand each request its own I/O context. A socket opened
 * during request A cannot be used by request B — reusing one throws
 * "Cannot perform I/O on behalf of a different request", which is precisely
 * what a module-scope connection cache produces. So on Workers we connect per
 * request and accept the handshake cost.
 *
 * Everywhere else (Vercel, `next dev`, `next start`) the cache is a real win
 * and stays exactly as it was.
 */
const isCloudflareWorkers =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers";

function getCached(): TMongooseConnection {
  if (isCloudflareWorkers) return { conn: null, promise: null };

  // @ts-expect-error - global is a NodeJS global variable
  if (!global.mongoose) {
    // @ts-expect-error - global is a NodeJS global variable
    global.mongoose = { conn: null, promise: null };
  }
  // @ts-expect-error - global is a NodeJS global variable
  return global.mongoose as TMongooseConnection;
}

async function dbConnect() {
  // Read at call time, never at module scope. On Workers the environment is
  // populated per request, so a module-scope read sees nothing and a
  // module-scope throw takes down the whole worker before it can serve
  // anything. It would also break `next build`, which imports this file.
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  const cached = getCached();

  if (cached.conn) {
    return cached.conn;
  }

  // Bypassing our own cache is not enough on Workers. The models in lib/models
  // are registered on the DEFAULT mongoose singleton (mongoose.model(...)), and
  // that singleton keeps its own connection state on the module, which outlives
  // the request. So mongoose.connect() returns instantly, reporting "connected",
  // while the socket underneath belongs to a request that has already finished.
  // The query then stalls until socketTimeoutMS expires — measured at ~10.8s per
  // request, versus ~2.3s for an honest reconnect.
  //
  // Tearing the stale connection down first forces a fresh socket in this
  // request's I/O context.
  if (isCloudflareWorkers && mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Mongoose waits 30s for server selection by default, but a Vercel
      // function is killed at 10s — so an unreachable cluster (paused, or an
      // IP the Atlas allowlist rejects) surfaced as an opaque 504 instead of
      // an error we could report. Fail well inside the function budget so the
      // caller gets a real exception and /unauthorized?reason=unavailable can
      // actually explain itself.
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      // A pool only pays off if it outlives the request. On Workers it cannot
      // (see isCloudflareWorkers above), so a pool of 10 would just open up to
      // ten TCP+TLS handshakes per request and throw nine of them away.
      maxPoolSize: isCloudflareWorkers ? 1 : 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
