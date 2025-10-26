import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

const USERS_FILE = "./users.json";

app.use(cors());
app.use(bodyParser.json());

// ✅ Hardcoded admin credentials
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_KEY = "mySecretAdminKey";

function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 🟢 Register route
app.post("/register", (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone)
    return res.status(400).json({ message: "All fields are required." });

  const users = readUsers();
  if (users.find(u => u.email === email))
    return res.status(400).json({ message: "Email already registered." });

  users.push({ name, email, password, phone, loginCount: 0 });
  saveUsers(users);
  return res.status(200).json({ message: "Registration successful!" });
});

// 🟢 Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // ✅ Check for admin first
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.status(200).json({ message: "Admin login successful!", admin: true });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid email or password." });

  user.loginCount = (user.loginCount || 0) + 1;
  saveUsers(users);
  return res.status(200).json({ message: "User login successful!", admin: false });
});

// 🟢 Admin route
app.get("/users", (req, res) => {
  const { adminkey } = req.headers;
  if (adminkey !== ADMIN_KEY) return res.status(403).json({ message: "Unauthorized" });

  const users = readUsers();
  return res.status(200).json(users);
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
