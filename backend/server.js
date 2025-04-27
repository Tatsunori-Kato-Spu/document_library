import express from "express";
import mysql from 'mysql2/promise';
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
app.use(cors());
app.use(express.json());
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Document Management API",
      version: "1.0.0",
      description: "API documentation for the document management system"
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Local server"
      }
    ]
  },
  apis: ["./server.js"], // <== แก้เป็นชื่อไฟล์จริงหากใช้ชื่ออื่น
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));


// -----------------------------------------------------
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',  // ✅ ใช้ชื่อ service ตาม Docker Compose
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'userdocs',
  port: process.env.DB_PORT || 3306,
});
//----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");
console.log("Upload directory:", uploadDir);
// ตัวกรองเฉพาะ PDF

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Directory created:", uploadDir);
} else {
  console.log("Directory already exists:", uploadDir);
}

// ตั้งค่าที่เก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // เก็บไฟล์ในโฟลเดอร์ uploads
  },
  filename: (req, file, cb) => {
    const docNumber = req.body.docNumber; // ดึง docNumber ที่ส่งมากับ form
    if (!docNumber) {
      return cb(new Error("Missing docNumber")); // ถ้าไม่มี docNumber ให้ Error เลย
    }
    cb(null, `${docNumber}.pdf`); // ตั้งชื่อไฟล์เป็น docNumber + .pdf
  }
});

const upload = multer({ storage, fileFilter });


/**
 * @swagger
 * tags:
 *   - name: Documents
 *     description: Document management
 *   - name: Users
 *     description: User management
 *   - name: Roles
 *     description: Role management
 *   - name: Departments
 *     description: Department management
 *   - name: Auth
 *     description: Authentication
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Invalid login credentials
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Retrieve the logged-in user's profile
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: The token for authenticating the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     email:
 *                       type: string
 *                     contact:
 *                       type: string
 *       404:
 *         description: User profile not found for the provided token
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * tags:
 *   - name: Documents
 *     description: Document management APIs
 *
 * /api/documents:
 *   get:
 *     tags: [Documents]
 *     summary: Retrieve documents accessible by a user's role
 *     description: ดึงเอกสารที่ผู้ใช้งานสามารถเข้าถึงได้ตาม role ของตัวเอง
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username ของผู้ใช้
 *     responses:
 *       200:
 *         description: A list of accessible documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   doc_number:
 *                     type: string
 *                     example: DOC-001
 *                   doc_name:
 *                     type: string
 *                     example: Purchase Request
 *                   subject:
 *                     type: string
 *                     example: Purchase of laptops
 *                   department:
 *                     type: string
 *                     example: IT Department
 *                   doc_date:
 *                     type: string
 *                     format: date
 *                     example: 2025-04-27
 *                   doc_time:
 *                     type: string
 *                     format: time
 *                     example: 14:30:00
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ไม่พบผู้ใช้งาน
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Database error
 *                 error:
 *                   type: string
 *                   example: Some SQL error message
 */

/**
 * @swagger
 * /api/documents/upload:
 *   post:
 *     tags: [Documents]
 *     summary: Upload a document with metadata
 *     description: Upload a PDF file along with metadata (docNumber, docName, subject, department, date, roles).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - docNumber
 *               - docName
 *               - subject
 *               - department
 *               - date
 *               - roles
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file to be uploaded.
 *               docNumber:
 *                 type: string
 *                 description: The unique document number.
 *               docName:
 *                 type: string
 *                 description: The name of the document.
 *               subject:
 *                 type: string
 *                 description: The subject of the document.
 *               department:
 *                 type: string
 *                 description: The department associated with the document.
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date the document was created.
 *               roles:
 *                 type: string
 *                 description: JSON array of roles (e.g., '["admin", "worker"]') that have access to the document.
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the upload was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the upload
 *                 documentId:
 *                   type: integer
 *                   description: The ID of the newly created document
 *       400:
 *         description: Invalid input data or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates failure
 *                 message:
 *                   type: string
 *                   description: The error message explaining the failure
 *       500:
 *         description: Internal server error during file upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *                   description: Detailed error message from the server
 */

/**
 * @swagger
 * /api/documents/lastDocNumber:
 *   get:
 *     tags: [Documents]
 *     summary: Get the last document number
 *     responses:
 *       200:
 *         description: The last document number retrieved
 *       404:
 *         description: No documents found
 */

/**
 * @swagger
 * /api/documents/{docNumber}:
 *   get:
 *     tags: [Documents]
 *     summary: Retrieve a document by its number
 *     parameters:
 *       - in: path
 *         name: docNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document found
 *       404:
 *         description: Document not found
 *
 *   put:
 *     tags: [Documents]
 *     summary: Update a document (including file upload)
 *     parameters:
 *       - in: path
 *         name: docNumber
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Document updated successfully
 *       400:
 *         description: Invalid file or document number
 *
 *   delete:
 *     tags: [Documents]
 *     summary: Delete a document by its number
 *     parameters:
 *       - in: path
 *         name: docNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 */

/**
 * @swagger
 * /api/documents/{docNumber}/file:
 *   get:
 *     tags: [Documents]
 *     summary: Retrieve the file of a specific document
 *     parameters:
 *       - in: path
 *         name: docNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document file found
 *       404:
 *         description: Document file not found
 */

/**
 * @swagger
 * /api/documents/search:
 *   post:
 *     tags: [Documents]
 *     summary: Search for documents
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of documents matching the search criteria
 *       400:
 *         description: Invalid search criteria
 */

/**
 * @swagger
 * /api/documents/search/filter:
 *   post:
 *     tags: [Documents]
 *     summary: Filter documents based on specific criteria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department:
 *                 type: string
 *               dateRange:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date
 *                   end:
 *                     type: string
 *                     format: date
 *     responses:
 *       200:
 *         description: List of documents after filtering
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   role:
 *                     type: string
 *
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *               - id_card
 *               - department
 *               - position
 *               - email
 *               - contact
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               id_card:
 *                 type: string
 *               department:
 *                 type: string
 *               position:
 *                 type: string
 *               email:
 *                 type: string
 *               contact:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, worker, guest]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid user data
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *
 *   put:
 *     tags: [Users]
 *     summary: Update a user's details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               id_card:
 *                 type: string
 *               department:
 *                 type: string
 *               position:
 *                 type: string
 *               email:
 *                 type: string
 *               contact:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Invalid user data
 */

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     tags: [Users]
 *     summary: Update the role of a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, worker, guest]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role or user ID
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Retrieve a list of all roles
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /api/departments:
 *   get:
 *     tags: [Departments]
 *     summary: Retrieve a list of departments
 *     responses:
 *       200:
 *         description: A list of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */


// -------------------------- Upload Document (PDF) --------------------------


app.post("/api/documents/upload", upload.single("file"), async (req, res) => {
  const { docNumber, docName, subject, department, date, roles } = req.body;
  const now = new Date();

  if (!req.file) {
    return res.status(400).json({ success: false, message: "ไม่พบไฟล์ PDF ที่อัปโหลด" });
  }

  if (!docNumber || !docName || !subject || !department || !date || !roles) {
    return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  // เช็ค roles อย่างน้อย 1 ค่า
  let parsedRoles;
  try {
    parsedRoles = JSON.parse(roles);
    if (!Array.isArray(parsedRoles) || parsedRoles.length === 0) {
      return res.status(400).json({ success: false, message: "กรุณาเลือกระดับอย่างน้อย 1 ตัว" });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: "รูปแบบ Role ไม่ถูกต้อง" });
  }

  const filePath = req.file.path;

  try {
    const [insertResult] = await pool.query(
      `INSERT INTO documents (doc_number, doc_name, subject, department, doc_date, doc_time, pdf_file)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [docNumber, docName, subject, department, date, now, filePath]
    );
    const docId = insertResult.insertId;

    for (const roleName of parsedRoles) {
      const [roleRows] = await pool.query(
        `SELECT id FROM roles WHERE LOWER(name) = LOWER(?)`,
        [roleName]
      );
      const baseRole = roleRows[0];
      if (baseRole) {
        await pool.query(
          `INSERT INTO document_roles (document_id, role_id) VALUES (?, ?)`,
          [docId, baseRole.id]
        );
      }
    }

    res.json({ success: true, message: "อัปโหลดสำเร็จ", documentId: docId });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
});




// -------------------------- Login --------------------------
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT users.*, roles.name AS role 
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE users.username = ? AND users.password = ?`,
      [username, password]
    );
    conn.release();

    if (rows.length === 1) {
      res.json({ success: true, userInfo: rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// Backend: Endpoint เพื่อดึงเลขเอกสารล่าสุด

app.get("/api/documents/lastDocNumber", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT doc_number FROM documents ORDER BY doc_number DESC LIMIT 1");
    if (result.length > 0) {
      const lastDocNumber = result[0].doc_number; // เลขเอกสารล่าสุด
      return res.json({ lastNumber: lastDocNumber });
    } else {
      return res.json({ lastNumber: "0000000" }); // ถ้าไม่มีเอกสารเลยให้เริ่มจาก 0000000
    }
  } catch (err) {
    console.error("Error fetching last document number:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// -------------------------- Documents by Role --------------------------
app.get("/api/documents", async (req, res) => {
  const { username } = req.query;

  try {
    // ดึงชื่อ role ของผู้ใช้
    const [userRows] = await pool.query(
      `SELECT roles.name AS role_name FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE users.username = ?`,
      [username]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    const userRole = userRows[0].role_name.toLowerCase();

    // สร้าง map ของ role ที่แต่ละคนสามารถเข้าถึงได้
    const roleVisibilityMap = {
      admin: ["admin", "worker", "guest"],
      worker: ["worker", "guest"],
      guest: ["guest"]
    };

    const visibleRoles = roleVisibilityMap[userRole] || [];

    // แปลงชื่อ role เป็น id
    const [roleIdRows] = await pool.query(
      `SELECT id FROM roles WHERE LOWER(name) IN (?)`,
      [visibleRoles]
    );
    const accessibleRoleIds = roleIdRows.map(r => r.id);

    if (accessibleRoleIds.length === 0) {
      return res.json([]);
    }

    // ดึงเอกสารที่ตรงกับ role id ที่เข้าถึงได้
    const [docs] = await pool.query(
      `SELECT DISTINCT d.id, d.doc_number, d.doc_name, d.subject, d.department, d.doc_date, d.doc_time 
       FROM documents d 
       JOIN document_roles dr ON d.id = dr.document_id 
       WHERE dr.role_id IN (?)`,
      [accessibleRoleIds]
    );

    res.json(docs);
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});


// ดึงข้อมูลเอกสารตามหมายเลขเอกสาร
app.get("/api/documents/:docNumber", async (req, res) => {
  const { docNumber } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM documents WHERE doc_number = ?`,
      [docNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบเอกสารนี้" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

app.get("/api/documents/:docNumber/file", async (req, res) => {
  const { docNumber } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT pdf_file FROM documents WHERE doc_number = ?`,
      [docNumber]
    );

    if (rows.length === 0 || !rows[0].pdf_file) {
      return res.status(404).json({ message: "ไม่พบไฟล์" });
    }

    const absolutePath = path.join(__dirname, rows[0].pdf_file); // <<== แก้ตรงนี้
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "ไฟล์ไม่อยู่ในระบบ" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${docNumber}.pdf"`);
    const fileStream = fs.createReadStream(absolutePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error("โหลดไฟล์ผิดพลาด:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});






// -------------------------- Search --------------------------
app.post("/api/documents/search", async (req, res) => {
  const { keyword, username } = req.body;
  try {
    const [userRows] = await pool.query(`SELECT role_id FROM users WHERE username = ?`, [username]);
    if (userRows.length === 0) return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    const roleId = userRows[0].role_id;
    const [docRows] = await pool.query(`
      SELECT d.* FROM documents d JOIN document_roles dr ON d.id = dr.document_id WHERE dr.role_id = ?`, [roleId]);

    const lowerKeyword = (keyword || "").trim().toLowerCase();
    const filtered = docRows.filter(doc =>
      !lowerKeyword ||
      doc.doc_name?.toLowerCase().includes(lowerKeyword) ||
      doc.doc_number?.includes(lowerKeyword)
    );
    res.json(filtered);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
});



app.post("/api/documents/search/filter", async (req, res) => {
  const { keyword, department, days } = req.body;
  const { username } = req.query;

  try {
    const [userRows] = await pool.query(
      `SELECT role_id FROM users WHERE username = ?`, [username]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    const roleId = userRows[0].role_id;
    const [docs] = await pool.query(`
      SELECT d.id, d.doc_number, d.doc_name, d.subject, d.department, d.doc_date, d.doc_time
      FROM documents d
      JOIN document_roles dr ON d.id = dr.document_id
      WHERE dr.role_id = ?
    `, [roleId]);

    const now = new Date();
    const filtered = docs.filter((doc) => {
      const lowerKeyword = keyword?.toLowerCase() || "";
      const matchKeyword = keyword
        ? doc.doc_name.toLowerCase().includes(lowerKeyword) ||
        doc.doc_number.includes(lowerKeyword)
        : true;

      const matchDept = department ? doc.department === department : true;

      const createdAt = new Date(doc.doc_date);
      const timeDiff = (now - createdAt) / (1000 * 60 * 60 * 24);
      const matchDays = days ? timeDiff <= days : true;

      return matchKeyword && matchDept && matchDays;
    });

    res.json(filtered);
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// -------------------------- Users --------------------------
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        users.id, users.username, users.name, users.id_card, 
        users.department, users.position, users.email, users.contact, 
        roles.name AS role
      FROM users
      JOIN roles ON users.role_id = roles.id
      ORDER BY users.id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});


app.get("/api/roles", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT id, name FROM roles`);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching roles:", err.message);
    res.status(500).json({ message: "Error fetching roles" });
  }
});

app.put("/api/users/:id/role", async (req, res) => {
  const userId = req.params.id;
  const { role: newRoleName } = req.body;

  try {
    // หา role_id จากชื่อ role
    const [roleRows] = await pool.query(
      `SELECT id FROM roles WHERE LOWER(name) = LOWER(?)`,
      [newRoleName]
    );
    if (roleRows.length === 0) {
      return res.status(400).json({ success: false, message: `ไม่พบ role: ${newRoleName}` });
    }
    const roleId = roleRows[0].id;

    // อัปเดต users.role_id
    await pool.query(
      `UPDATE users SET role_id = ? WHERE id = ?`,
      [roleId, userId]
    );

    res.json({ success: true, message: "เปลี่ยน role สำเร็จ" });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ success: false, message: "อัปเดต role ล้มเหลว", error: err.message });
  }
});

app.post("/api/users", async (req, res) => {
  const {
    username,
    password,
    name,
    id_card,
    department,
    position,
    email,
    contact,
    role // ค่าที่ส่งมาเป็น string: "admin"/"worker"/"guest"
  } = req.body;

  try {
    // หา role_id จากชื่อ role
    const [roleRows] = await pool.query(
      `SELECT id FROM roles WHERE LOWER(name)=LOWER(?)`,
      [role]
    );
    if (roleRows.length === 0) {
      return res.status(400).json({ success: false, message: `ไม่พบ role: ${role}` });
    }
    const roleId = roleRows[0].id;
    const token = uuidv4(); // สุ่ม token ให้ user

    // ใส่ข้อมูลลงตาราง users
    const [result] = await pool.query(
      `INSERT INTO users
        (username, password, name, id_card, department, position, email, contact, role_id, token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, password, name, id_card, department, position, email, contact, roleId, token]
    );

    res.json({ success: true, message: "สร้างผู้ใช้ใหม่สำเร็จ", userId: result.insertId });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ success: false, message: "สร้างผู้ใช้ล้มเหลว", error: err.message });
  }
});

// แก้ไข้ข้อมูล member
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT users.id, users.name, users.id_card, users.department, users.position, users.email, users.contact, roles.name AS role
       FROM users
       JOIN roles ON users.role_id = roles.id
       WHERE users.id = ?`, [id]
    );

    if (rows.length === 0) {
      console.log("ไม่พบผู้ใช้ id =", id);
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});
// อัปเดตข้อมูล user
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, id_card, department, position, email, contact } = req.body;

  try {
    await pool.query(
      `UPDATE users SET name = ?, id_card = ?, department = ?, position = ?, email = ?, contact = ? WHERE id = ?`,
      [name, id_card, department, position, email, contact, id]
    );

    res.json({ success: true, message: "อัปเดตข้อมูลผู้ใช้สำเร็จ" });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ success: false, message: "อัปเดตล้มเหลว", error: err.message });
  }
});


// -------------------------- Profile --------------------------
app.get("/api/profile", async (req, res) => {
  const { token } = req.query;
  try {
    const [rows] = await pool.query(
      `SELECT users.*, roles.name AS role FROM users JOIN roles ON users.role_id = roles.id WHERE users.token = ?`,
      [token]
    );
    if (rows.length === 1) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.json({ success: false, message: "ไม่พบผู้ใช้สำหรับ token นี้" });
    }
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------------- Delete Document --------------------------
app.delete("/api/documents/:docNumber", async (req, res) => {
  const { docNumber } = req.params;
  try {
    // ดึง path ของไฟล์ก่อนลบเอกสาร
    const [docRows] = await pool.query(
      `SELECT pdf_file FROM documents WHERE doc_number = ?`,
      [docNumber]
    );

    if (docRows.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบเอกสารนี้" });
    }

    const filePath = docRows[0].pdf_file;

    // ลบจาก document_roles ก่อน
    await pool.query(
      `DELETE FROM document_roles WHERE document_id IN (SELECT id FROM documents WHERE doc_number = ?)`,
      [docNumber]
    );

    // ลบจาก documents
    await pool.query(`DELETE FROM documents WHERE doc_number = ?`, [docNumber]);

    // ลบไฟล์ PDF ออกจากระบบไฟล์
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // ใช้แบบ synchronous หรือใช้ await fs.promises.unlink(filePath) ก็ได้
    }

    res.json({ success: true, message: "ลบเอกสารและไฟล์เรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ success: false, message: "ลบเอกสารล้มเหลว", error: err.message });
  }
});

// -------------------------- Update edit Document --------------------------
app.put("/api/documents/:docNumber", upload.single("pdf"), async (req, res) => {
  const { docNumber } = req.params;
  const { doc_name, subject, department, role, date } = req.body;
  const newPdf = req.file;

  try {
    // หาไฟล์เดิมก่อน (ถ้ามี)
    const [existingDocs] = await pool.query(
      `SELECT id, pdf_file FROM documents WHERE doc_number = ?`,
      [docNumber]
    );

    if (existingDocs.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบเอกสาร" });
    }

    const docId = existingDocs[0].id;
    const oldFilePath = existingDocs[0].pdf_file;

    // ถ้ามีไฟล์ใหม่ → ลบไฟล์เก่า
    let newPath = oldFilePath;
    if (newPdf) {
      newPath = "uploads/" + newPdf.filename;

      if (oldFilePath && fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // อัปเดตตาราง documents
    await pool.query(
      `UPDATE documents 
       SET doc_name = ?, subject = ?, department = ?, doc_date = ?, pdf_file = ? 
       WHERE doc_number = ?`,
      [doc_name, subject, department, date || new Date(), newPath, docNumber]
    );

    // อัปเดต role ใหม่ (ลบเก่า → ใส่ใหม่)
    if (role) {
      const [roleRows] = await pool.query(
        `SELECT id FROM roles WHERE LOWER(name) = LOWER(?)`,
        [role]
      );

      const roleId = roleRows[0]?.id;
      if (roleId) {
        await pool.query(`DELETE FROM document_roles WHERE document_id = ?`, [docId]);
        await pool.query(
          `INSERT INTO document_roles (document_id, role_id) VALUES (?, ?)`,
          [docId, roleId]
        );
      }
    }

    res.json({ success: true, message: "อัปเดตเอกสารเรียบร้อย" });
  } catch (err) {
    console.error("Error updating document:", err.message);
    res.status(500).json({ success: false, message: "อัปเดตล้มเหลว" });
  }
});

// -------------------------- edit department --------------------------
app.get("/api/departments", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT DISTINCT department FROM documents WHERE department IS NOT NULL AND department <> ''`);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching departments:", err.message);
    res.status(500).json({ message: "Error fetching departments" });
  }
});
////////////////////////////No
app.post('/api/documents', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.id, d.doc_name, d.subject, d.doc_date, d.doc_time, d.department
      FROM documents d
      ORDER BY d.doc_date DESC, d.doc_time DESC
      LIMIT 5;
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).send('Server error');
  }
});


// -------------------------- Start server --------------------------
app.listen(3001, () => {
  console.log("✅ Backend running on http://localhost:3001");
});

