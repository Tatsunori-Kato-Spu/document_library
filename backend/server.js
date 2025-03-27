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
      .query('SELECT * FROM users WHERE username = @username AND password = @password');

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
app.get('/api/documents', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM documents');
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Database error');
  }
});

// -------------------------- Start server --------------------------
app.listen(3001, () => {
  console.log('✅ Backend running on http://localhost:3001');
});
