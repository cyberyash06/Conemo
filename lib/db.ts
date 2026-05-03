import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://fallback";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-expect-error - global.mongoose is not defined in NodeJS global scope
let cached = global.mongoose;

if (!cached) {
  // @ts-expect-error - global.mongoose is not defined in NodeJS global scope
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.warn("⚠️ Skipping DB connection during build");
    return;
  }
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
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

export default connectDB;
