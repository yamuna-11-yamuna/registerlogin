// backend/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const {
  MONGO_USER = "yamunayy111_db_user",
  MONGO_PASSWORD,
  MONGO_HOST = "cluster0.rbafdod.mongodb.net",
  MONGO_DB_NAME = "yourDatabaseName",           // ← replace with your actual DB name
  MONGO_PARAMS = "retryWrites=true&w=majority",
} = process.env;

if (!MONGO_PASSWORD) {
  console.warn("⚠️  Warning: MONGO_PASSWORD not set in .env file");
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

