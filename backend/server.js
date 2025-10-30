import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

const USERS_FILE = "./users.json";

app.use(cors());
app.use(bodyParser.json());



const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_KEY = "mySecretAdminKey";
@@ -29,7 +29,7 @@
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}



app.post("/register", (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone)
@@ -44,11 +44,11 @@
  return res.status(200).json({ message: "Registration successful!" });
});



app.post("/login", (req, res) => {
  const { email, password } = req.body;

 
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.status(200).json({ message: "Admin login successful!", admin: true });
  }
@@ -62,7 +62,7 @@
  return res.status(200).json({ message: "User login successful!", admin: false });
});



app.get("/users", (req, res) => {
  const { adminkey } = req.headers;
  if (adminkey !== ADMIN_KEY) return res.status(403).json({ message: "Unauthorized" });
@@ -71,5 +71,5 @@
  return res.status(200).json(users);
});

// Start server

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
