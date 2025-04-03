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
  password: "irs@2023",
  database: "mar28",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body; // Receive role from frontend

    const [results] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

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
    
    res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, role: user.role },
      token
    });
    
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
});

// app.post("/api/logout",(req,res) => {
//   const token = req.headers["authorization"];
//   if(!token) return res.status(400).json({message: "No token provided"});
//   res.json({message: "Logged out successfully"});
// });

// Handle new request submissions
app.post("/api/new-request", upload.single("idCard"), async (req, res) => {
  console.log("Received Data:", req.body);
  console.log("Uploaded File:", req.file); 
  const {
    requestType,
    fullName,
    email,
    requestDate,
    requestTime,
    requestTimeEnd,
    description,
    faculty,
    requester_id,
    clubName,
    eventName,
    phoneNumber,
    pointOfContact,
    venueLocation,
    
    
  } = req.body;
  console.log("Faculty:", faculty);
  console.log("Requester ID:", requester_id);
  const idCardPath = req.file ? `/id_cards/${req.file.filename}` : null;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Insert into `requests` table
    const [requestResult] = await connection.execute(
      `INSERT INTO requests 
      (request_type, full_name, email, request_date, request_time, request_time_end, description, id_card_upload, status, requester_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [requestType, fullName, email, requestDate, requestTime, requestTimeEnd, description, idCardPath, requester_id]
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

    // Insert into `approvals` table with faculty ID
    await connection.execute(
      `INSERT INTO approvals (request_id, approver_id, status) VALUES (?, ?, 'pending')`,
      [requestId, faculty]
    );

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

app.get("/api/faculty-coordinators", async (req, res) => {
  const connection = await db.getConnection();

  try {
    // Get all faculty names with role 'Faculty_Coordinator_Club'
    const [results] = await connection.execute(
      `SELECT u.id, u.name, fr.club_name
       FROM users u
       JOIN faculty_roles fr ON u.id = fr.user_id
       JOIN roles r ON fr.role_id = r.id
       WHERE r.role_name = 'Faculty_Coordinator_Club'`
    );

    res.status(200).json({ faculties: results });
  } catch (error) {
    console.error("Error fetching faculty coordinators:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    connection.release();
  }
});



// Middleware to authenticate and extract user ID
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};
// const jwt = require("jsonwebtoken");

app.get("/api/requests/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Fetching requests for requester ID:", id);

  try {
    const [requests] = await db.query(
      "SELECT * FROM requests WHERE requester_id = ?",
      [id]
    );

    console.log("Requests:", requests);
    res.json(requests);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error fetching requests" });
  }
});

app.get("/api/approvals/:requestId", async (req, res) => {
  const { requestId } = req.params;
  console.log("Fetching approvals for request ID:", requestId);

  try {
    const [approvals] = await db.query(
      `
      SELECT 
        a.status, 
        u.name AS approver_name, 
        r.role_name, 
        r.hierarchy
      FROM approvals a
      JOIN users u ON a.approver_id = u.id
      JOIN faculty_roles fr ON u.id = fr.user_id
      JOIN roles r ON fr.role_id = r.id
      WHERE a.request_id = ?
      ORDER BY r.hierarchy ASC;
      `,
      [requestId]
    );

    console.log("Approvals:", approvals);
    res.json(approvals);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error fetching approvals" });
  }
});



// Get approval counts based on faculty (approver_id)
app.get("/api/faculty-approvals", authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization // Extract token
    console.log("Token2:", token);
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, "your_secret_key", async (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });

      
    const approverId = req.user.id; // Extract faculty's ID from the token

    const query = `
      SELECT status, COUNT(*) as count
      FROM approvals
      WHERE approver_id = ?
      GROUP BY status
    `;

    const [results] = await db.execute(query, [approverId]);

    const data = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    results.forEach(row => {
      if (row.status === "Pending") data.pending = row.count;
      else if (row.status === "Approved") data.approved = row.count;
      else if (row.status === "Rejected") data.rejected = row.count;
    });

    res.json(data);
  });
 } catch (error) {
    console.error("Error fetching faculty approvals:", error);
    res.status(500).json({ error: "Database error" });
  }
});
app.get("/api/faculty-requests", authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log("Token3:", token);
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, "your_secret_key", async (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });

      const approverId = req.user.id; // Extract faculty's ID from the token

      const query = `
        SELECT 
    r.id AS request_id, 
    r.full_name AS name, 
    r.email, 
    r.request_date AS date, 
    r.request_time AS time, 
    r.description, 
    r.id_card_upload AS id_card,
    r.status,
    r.request_type AS permission,
    COALESCE(v.club_name, e.club_name) AS club, 
    COALESCE(v.event_name, e.event_name) AS event, 
    COALESCE(v.phone_number, e.phone_number) AS phone, 
    COALESCE(v.point_of_contact, e.point_of_contact) AS contact
FROM approvals a
JOIN requests r ON a.request_id = r.id
LEFT JOIN venue_permissions v ON r.id = v.request_id
LEFT JOIN events_permissions e ON r.id = e.request_id
WHERE a.approver_id = ? and a.status = 'Pending';

      `;

      const [requests] = await db.execute(query, [approverId]);

      res.json(requests);
    });
  } catch (error) {
    console.error("Error fetching faculty requests:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/next-approvers", authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, "your_secret_key", async (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });

      const { type, hierarchy } = req.query; // 'event' or 'venue' and current hierarchy
      const nextHierarchy = parseInt(hierarchy) + 1;
      console.log("Next Hierarchy:", nextHierarchy);
      console.log("Type:", type);
      const query = `
        SELECT u.id, u.name, r.role_name
        FROM users u
        JOIN faculty_roles fr ON u.id = fr.user_id
        JOIN roles r ON fr.role_id = r.id
        WHERE r.hierarchy = ? AND r.permission = ?;
      `;

      const [approvers] = await db.execute(query, [nextHierarchy, type]);

      res.json(approvers);
    });
  } catch (error) {
    console.error("Error fetching next approvers:", error);
    res.status(500).json({ error: "Database error" });
  }
});
app.get("/api/current-hierarchy", authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, "your_secret_key", async (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });

      const userId = decoded.id; // Extract user ID from token

      const query = `
        SELECT r.hierarchy, r.role_name, r.permission
        FROM faculty_roles fr
        JOIN roles r ON fr.role_id = r.id
        WHERE fr.user_id = ?;
      `;

      const [results] = await db.execute(query, [userId]);

      if (results.length === 0) {
        return res.status(404).json({ error: "Faculty role not found" });
      }

      res.json(results[0]); // Return the faculty's hierarchy, role, and permission
    });
  } catch (error) {
    console.error("Error fetching current hierarchy:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// app.post("/api/approve-request", authenticateToken, async (req, res) => {
//   try {
//     const { request_id, approver_id } = req.body;
//     const approverId = req.user.id; // Current logged-in approver's ID

//     if (!approver_id) {
//       return res.status(400).json({ message: "Next approver must be selected." });
//     }

//     // ✅ Get current approver's hierarchy, role, and permission
//     const hierarchyQuery = `
//       SELECT r.hierarchy, r.role_name, r.permission
//       FROM faculty_roles fr
//       JOIN roles r ON fr.role_id = r.id
//       WHERE fr.user_id = ?;
//     `;
//     const [approverData] = await db.execute(hierarchyQuery, [approverId]);

//     if (approverData.length === 0) {
//       return res.status(403).json({ message: "Unauthorized approver" });
//     }

//     const currentHierarchy = approverData[0].hierarchy;
//     const permission = approverData[0].permission;

//     // ✅ Fetch current request details
//     const [requestData] = await db.execute(
//       `SELECT * FROM approvals WHERE request_id = ? AND approver_id = ?`,
//       [request_id, approverId]
//     );

//     if (requestData.length === 0) {
//       return res.status(404).json({ message: "Request not found or unauthorized approver" });
//     }

//     console.log(`✅ Approving Request ID: ${request_id}`);
//     console.log(`🔹 Current Approver ID: ${approverId} (Hierarchy: ${currentHierarchy})`);
//     console.log(`🔹 Next Approver ID: ${approver_id}`);

//     // ✅ Ensure the selected approver is in the next hierarchy level
//     const nextHierarchyLevel = currentHierarchy + 1;
//     const nextApproverQuery = `
//       SELECT r.hierarchy
//       FROM faculty_roles fr
//       JOIN roles r ON fr.role_id = r.id
//       WHERE fr.user_id = ?;
//     `;
//     const [nextApproverData] = await db.execute(nextApproverQuery, [approver_id]);

//     if (nextApproverData.length === 0 || nextApproverData[0].hierarchy !== nextHierarchyLevel) {
//       return res.status(400).json({ message: "Invalid approver selection. Approver must be in the next hierarchy level." });
//     }

//     // ✅ Step 1: Update the current approver's status to 'Approved'
//     await db.execute(
//       `UPDATE approvals SET status = 'Approved', approval_date = NOW() WHERE request_id = ? AND approver_id = ?`,
//       [request_id, approverId]
//     );

//     // ✅ Step 2: Insert new row for the next hierarchy approver
//     await db.execute(
//       `INSERT INTO approvals (request_id, approver_id, status, comments, approval_date) VALUES (?, ?, ?, ?, NOW())`,
//       [request_id, approver_id, "Pending", null]
//     );

//     res.json({ message: "Request approved and forwarded to the next approver." });
//   } catch (error) {
//     console.error("❌ Error approving request:", error);
//     res.status(500).json({ error: "Database error. Please try again later." });
//   }
// });

app.post("/api/approve-request", authenticateToken, async (req, res) => {
  try {
    const { request_id, approver_id } = req.body;
    const approverId = req.user.id; // Current approver's ID

    // ✅ Get current approver's hierarchy
    const hierarchyQuery = `
      SELECT r.hierarchy, r.role_name, r.permission
      FROM faculty_roles fr
      JOIN roles r ON fr.role_id = r.id
      WHERE fr.user_id = ?;
    `;
    const [approverData] = await db.execute(hierarchyQuery, [approverId]);

    if (approverData.length === 0) {
      return res.status(403).json({ message: "Unauthorized approver" });
    }

    const currentHierarchy = approverData[0].hierarchy;

    // ✅ Fetch current request details
    const [requestData] = await db.execute(
      `SELECT * FROM approvals WHERE request_id = ? AND approver_id = ?`,
      [request_id, approverId]
    );

    if (requestData.length === 0) {
      return res.status(404).json({ message: "Request not found or unauthorized approver" });
    }

    // ✅ Find if there are next-level approvers
    const nextHierarchyLevel = currentHierarchy + 1;
    const nextApproverQuery = `
      SELECT fr.user_id FROM faculty_roles fr
      JOIN roles r ON fr.role_id = r.id
      WHERE r.hierarchy = ?;
    `;
    const [nextApprovers] = await db.execute(nextApproverQuery, [nextHierarchyLevel]);

    // ✅ Approve request for current user
    await db.execute(
      `UPDATE approvals SET status = 'Approved', approval_date = NOW() WHERE request_id = ? AND approver_id = ?`,
      [request_id, approverId]
    );

    if (nextApprovers.length === 0) {
      // ✅ No further approvers, mark request as "Fully Approved"
      await db.execute(
        `UPDATE requests SET status = 'Approved' WHERE id = ?`,
        [request_id]
      );
      return res.json({ message: "Request fully approved!" });
    }

    if (!approver_id) {
      return res.status(400).json({ message: "Next approver must be selected." });
    }

    // ✅ Forward to next approver
    await db.execute(
      `INSERT INTO approvals (request_id, approver_id, status, comments, approval_date) VALUES (?, ?, ?, ?, NOW())`,
      [request_id, approver_id, "Pending", null]
    );

    res.json({ message: "Request approved and forwarded to the next approver." });
  } catch (error) {
    console.error("❌ Error approving request:", error);
    res.status(500).json({ error: "Database error. Please try again later." });
  }
});

app.post("/api/deny-request", authenticateToken, async (req, res) => {
  try {
    const { request_id, comments } = req.body;
    const approverId = req.user.id; // Current logged-in approver's ID
    console.log("sd",req.body);
    // ✅ Check if the request exists and is assigned to the current approver
    const [requestData] = await db.execute(
      `SELECT * FROM approvals WHERE request_id = ? AND approver_id = ? AND status = 'Pending'`,
      [request_id, approverId]
    );

    if (requestData.length === 0) {
      return res.status(404).json({ message: "Request not found or already processed" });
    }

    console.log(`❌ Denying Request ID: ${request_id}`);
    console.log(`🔹 Approver ID: ${approverId}`);

    // ✅ Step 1: Update the request status to 'Rejected'
    await db.execute(
      `UPDATE approvals SET status = 'Rejected', comments = ?, approval_date = NOW() WHERE request_id = ? AND approver_id = ?`,
      [comments || "No comments provided", request_id, approverId]
    );

    res.json({ message: "Request denied successfully." });
  } catch (error) {
    console.error("❌ Error denying request:", error);
    res.status(500).json({ error: "Database error. Please try again later." });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});



app.get("/api/approved-venues", async (req, res) => {
  try {
    const query = `
      SELECT r.request_date, r.request_time, r.request_time_end, v.venue_location, v.event_name, v.club_name
      FROM requests r
      JOIN venue_permissions v ON r.id = v.request_id
      WHERE r.status = 'Approved'
      ORDER BY r.request_date, r.request_time;
    `;

    const [results] = await db.execute(query);

    res.json(results);
  } catch (error) {
    console.error("Error fetching approved venues:", error);
    res.status(500).json({ message: "Database error", error: error.message });
  }
});

