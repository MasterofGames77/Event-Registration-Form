import mongoose from 'mongoose';

// Ensure MONGO_URI is not undefined by using the non-null assertion operator (!)
const MONGO_URI = process.env.MONGODB_URI!;

if (!MONGO_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */

// Extend the global object to include the mongoose property
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'registerDB', // Explicitly set the database name
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      return mongooseInstance.connection;  // Return the connection object
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectMongo;