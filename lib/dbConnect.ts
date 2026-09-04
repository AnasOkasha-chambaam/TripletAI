// /lib/dbConnect.ts

import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

type TMongooseConnection = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};
// @ts-expect-error - global is a NodeJS global variable
let cached: TMongooseConnection = global.mongoose;

if (!cached) {
  // @ts-expect-error - global is a NodeJS global variable
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
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
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
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
