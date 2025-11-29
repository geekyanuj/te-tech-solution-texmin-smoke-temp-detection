import mongoose from "mongoose";
import { APP_ENV, MONGODB } from "./env.js";

let db = null;

export async function connectDB() {
  try {
    const uri = MONGODB[APP_ENV].uri;

    const conn = await mongoose.connect(uri, {
      dbName: "smoke-temp-db",
    });

    db = conn.connection;
    console.log("Mongoose connected:", db.host);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

export function getDB() {
  return db;
}
