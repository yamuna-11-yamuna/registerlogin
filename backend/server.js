// server.js (or backend/index.js)
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });


import { connectDB } from "./db.js";             // adjust path if needed
import User from "./models/users.js";             // adjust path if needed

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Admin credentials
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_KEY = "mySecretAdminKey";

// Connect to MongoDB first
await connectDB();

// === REGISTER USER ===
app.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields (name, email, password, phone) are required." });
  }

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create new user document
    const newUser = new User({ name, email, password, phone });
    await newUser.save();

    return res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error during registration." });
  }
});

// === LOGIN USER ===
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Admin login check
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return res.status(200).json({ message: "Admin login successful!", admin: true });
    }

    // User login: find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check password (plain text for now)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Update login count
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    return res.status(200).json({ message: "User login successful!", admin: false });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
});

// === GET ALL USERS (admin only) ===
app.get("/users", async (req, res) => {
  const { adminkey } = req.headers;
  if (adminkey !== ADMIN_KEY) {
    return res.status(403).json({ message: "Unauthorized: invalid admin key." });
  }

  try {
    const users = await User.find({}, "-password"); // exclude password field for safety
    return res.status(200).json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    return res.status(500).json({ message: "Server error retrieving users." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

