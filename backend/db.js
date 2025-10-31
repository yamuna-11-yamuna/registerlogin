// backend/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the .env file in the same folder
dotenv.config({ path: path.resolve(__dirname, ".env") });

const {
  MONGO_USER = "yamunayy111_db_user",
  MONGO_PASSWORD,
  MONGO_HOST = "cluster0.rbafdod.mongodb.net",
  MONGO_DB_NAME = "yourDatabaseName",  // ← replace with your actual DB name in .env or here
  MONGO_PARAMS = "retryWrites=true&w=majority",
} = process.env;

if (!MONGO_PASSWORD) {
  console.warn("⚠️ Warning: MONGO_PASSWORD not set in .env file");
}

const MONGO_URI = `mongodb+srv://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOST}/${MONGO_DB_NAME}?${MONGO_PARAMS}`;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};


