// backend/db.js
import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://yamunayy111_db_user:<MySecretPassWord123>@cluster0.rbafdod.mongodb.net/?appName=Cluster0"


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
