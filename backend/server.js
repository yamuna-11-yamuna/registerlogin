import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./db.js";
import User from "./models/User.js";

const app = express();
const PORT = process.env.PORT || 5000;

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_KEY = "mySecretAdminKey";

app.use(cors());
app.use(bodyParser.json());

// Connect MongoDB
connectDB();

// 🟢 Register
app.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered." });

    const user = new User({ name, email, password, phone });
    await user.save();

    return res.status(200).json({ message: "Registration successful!" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.status(200).json({ message: "Admin login successful!", admin: true });
  }

  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    user.loginCount += 1;
    await user.save();

    return res.status(200).json({ message: "User login successful!", admin: false });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Admin route
app.get("/users", async (req, res) => {
  const { adminkey } = req.headers;
  if (adminkey !== ADMIN_KEY) return res.status(403).json({ message: "Unauthorized" });

  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
