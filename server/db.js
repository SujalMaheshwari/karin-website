import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverDir = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();
dotenv.config({ path: path.join(serverDir, ".env") });

let connectionPromise = null;

export function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (!process.env.MONGO_URI) {
    return Promise.reject(new Error("MONGO_URI is not configured."));
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI);
  }

  return connectionPromise;
}
