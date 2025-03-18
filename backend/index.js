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

app.post("/api/new-request", async (req, res) => {
  const {
    requestType,
    fullName,
    email,
    requestDate,
    requestTime,
    description,
    idCardUpload,
    clubName,
    eventName,
    phoneNumber,
    pointOfContact,
  } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Insert into `requests` table
    const [requestResult] = await connection.execute(
      `INSERT INTO requests 
      (request_type, full_name, email, request_date, request_time, description, id_card_upload, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [requestType, fullName, email, requestDate, requestTime, description, idCardUpload]
    );

    const requestId = requestResult.insertId; // Get last inserted request ID

    // If the request type is 'event', insert into `events_permissions`
    if (requestType === "event") {
      await connection.execute(
        `INSERT INTO events_permissions (request_id, club_name, event_name, phone_number, point_of_contact) 
        VALUES (?, ?, ?, ?, ?)`,
        [requestId, clubName, eventName, phoneNumber, pointOfContact]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Request submitted successfully", requestId });

  } catch (error) {
    await connection.rollback();
    console.error("Error submitting request:", error);
    res.status(500).json({ error: "Internal server error" });

  } finally {
    connection.release();
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
