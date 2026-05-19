/**
 * Run this once to create the admin account in MongoDB:
 *   node server/scripts/createAdmin.js
 *
 * It reads ADMIN_USERNAME and ADMIN_PASSWORD from your .env file.
 */

import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import { connectDB } from "../db.js";

const run = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const username = process.env.ADMIN_USERNAME?.toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD are required.");
    }

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log("Admin already exists. Delete it in MongoDB first if you want to recreate.");
      process.exit(0);
    }

    await Admin.create({ username, password });

    console.log(`Admin created: username = "${username}"`);
    console.log("You can now log in at /admin on your frontend.");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
