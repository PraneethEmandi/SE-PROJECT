const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "peace",
  database: "seproject2",
});

app.post("/api/login", (req, res) => {
  const { email, password, role } = req.body; // Receive role from frontend

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // Check if role matches
    if (user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role selection" });
    }

    // Directly compare passwords (for prototype only)
    if (password !== user.password_hash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "your_secret_key", { expiresIn: "1h" });

    res.json({ message: "Login successful", user: { name: user.name, role: user.role }, token });
  });
});



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
