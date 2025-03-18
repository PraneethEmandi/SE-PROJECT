const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// Ensure id_cards directory exists
const idCardsDir = path.join(__dirname, "id_cards");
if (!fs.existsSync(idCardsDir)) {
  fs.mkdirSync(idCardsDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, idCardsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only PNG, JPEG, and PDF files are allowed."));
    }
    cb(null, true);
  },
});



const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "peace",
  database: "seproject2",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


app.post("/api/login", (req, res) => {
  const { email, password, role } = req.body; // Receive role from frontend
  app.use(express.urlencoded({ extended: true }));

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

// Handle new request submissions
app.post("/api/new-request", upload.single("idCard"), async (req, res) => {
  const {
    requestType,
    fullName,
    email,
    requestDate,
    requestTime,
    description,
    clubName,
    eventName,
    phoneNumber,
    pointOfContact,
    venueLocation, // Added for venue requests
  } = req.body;

  const idCardPath = req.file ? `/id_cards/${req.file.filename}` : null;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Insert into `requests` table
    const [requestResult] = await connection.execute(
      `INSERT INTO requests 
      (request_type, full_name, email, request_date, request_time, description, id_card_upload, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [requestType, fullName, email, requestDate, requestTime, description, idCardPath]
    );

    const requestId = requestResult.insertId; // Get last inserted request ID

    if (requestType === "event") {
      // Insert into `events_permissions`
      await connection.execute(
        `INSERT INTO events_permissions (request_id, club_name, event_name, phone_number, point_of_contact) 
        VALUES (?, ?, ?, ?, ?)`,
        [requestId, clubName, eventName, phoneNumber, pointOfContact]
      );
    } else if (requestType === "venue") {
      // Insert into `venue_permissions`
      await connection.execute(
        `INSERT INTO venue_permissions (request_id, venue_location, club_name, event_name, phone_number, point_of_contact) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [requestId, venueLocation, clubName, eventName, phoneNumber, pointOfContact]
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
