import express from 'express';
import sql from 'mssql';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json()); // ✅ <<== ต้องใส่ตรงนี้ เพื่อให้รับ req.body JSON ได้

const config = {
  user: "sa",
  password: "Sa123456!",
  server: "localhost", // หรือ "127.0.0.1"
  port: 1433,
  database: "userdocs",
  options: {
    trustServerCertificate: true, 
  },
};

// -------------------------- Login --------------------------
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .query(`
        SELECT users.*, roles.name AS role 
        FROM users 
        JOIN roles ON users.role_id = roles.id 
        WHERE users.username = @username AND users.password = @password
      `);

    if (result.recordset.length === 1) {
      res.json({ success: true, userInfo: result.recordset[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// -------------------------- Documents --------------------------
// ✅ API ดึงเอกสารตาม role ของ username
app.get('/api/documents', async (req, res) => {
  const { username } = req.query; // รับ username จาก frontend

  try {
    await sql.connect(config);

    // ค้นหา role_id ของ user
    const userQuery = await sql.query`SELECT role_id FROM users WHERE username = ${username}`;
    if (userQuery.recordset.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    const roleId = userQuery.recordset[0].role_id;

    // ดึงเอกสารที่ตรงกับ role_id ของ user
    const documentQuery = await sql.query`
      SELECT d.id, d.doc_number, d.doc_name, d.subject, d.department, d.doc_date, d.doc_time
      FROM documents d
      JOIN document_roles dr ON d.id = dr.document_id
      WHERE dr.role_id = ${roleId}
    `;

    res.json(documentQuery.recordset); // ส่งข้อมูลเอกสารที่สามารถเข้าถึงได้
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่ฐานข้อมูล", error: err.message });
  }
});


app.get("/api/documents/:id", async (req, res) => {
  try {
    const docId = req.params.id;
    await sql.connect(config);

    // ใช้ parameterized query แทน
    const result = await sql.query`SELECT * FROM documents WHERE doc_number = ${docId}`;

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: "ไม่พบเอกสารที่มีหมายเลขนี้" });
    }
  } catch (err) {
    console.error('SQL error:', err.message);  
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่ฐานข้อมูล", error: err.message });
  }
});


// -------------------------- Users: Get + Update Role --------------------------
app.get('/api/users', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.query(`
      SELECT users.id, users.name, users.id_card, users.department, users.position, users.email, users.contact, roles.name AS role
      FROM users
      JOIN roles ON users.role_id = roles.id
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

app.put('/api/users/:id/role', async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  try {
    const pool = await sql.connect(config);
    const roleResult = await pool
      .request()
      .input('role', sql.NVarChar, role)
      .query('SELECT id FROM roles WHERE name = @role');

    if (roleResult.recordset.length === 0) {
      return res.status(400).json({ message: 'Role not found' });
    }

    const roleId = roleResult.recordset[0].id;

    await pool
      .request()
      .input('role_id', sql.Int, roleId)
      .input('id', sql.Int, userId)
      .query('UPDATE users SET role_id = @role_id WHERE id = @id');

    res.json({ message: 'Role updated' });
  } catch (err) {
    console.error("Error updating role:", err.message);
    res.status(500).json({ message: "Update error", error: err.message });
  }
});

// -------------------------- Profile: user  --------------------------
app.get('/api/profile', async (req, res) => {
  const { token } = req.query;
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('token', sql.VarChar, token)
      .query(`
        SELECT users.*, roles.name AS role 
        FROM users 
        JOIN roles ON users.role_id = roles.id 
        WHERE users.token = @token
      `);

    if (result.recordset.length === 1) {
      res.json({ success: true, user: result.recordset[0] });
    } else {
      res.json({ success: false, message: "ไม่พบผู้ใช้สำหรับ token นี้" });
    }
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// -------------------------- Start server --------------------------
app.listen(3001, () => {
  console.log('✅ Backend running on http://localhost:3001');
});
