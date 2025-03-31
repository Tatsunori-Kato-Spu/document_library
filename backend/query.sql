-- ✅ สร้าง database ถ้ายังไม่มี
IF DB_ID('userdocs') IS NULL
    CREATE DATABASE userdocs;
GO

-- ✅ ใช้งาน database
USE userdocs;
GO

-- 🔥 ลบตารางเก่าหากมีอยู่
IF OBJECT_ID('document_roles', 'U') IS NOT NULL DROP TABLE document_roles;
IF OBJECT_ID('documents', 'U') IS NOT NULL DROP TABLE documents;
IF OBJECT_ID('users', 'U') IS NOT NULL DROP TABLE users;
IF OBJECT_ID('roles', 'U') IS NOT NULL DROP TABLE roles;
GO

-- 📄 roles table
CREATE TABLE roles (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- 👤 users table
CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) NOT NULL UNIQUE,
    password NVARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    token NVARCHAR(100),
    image NVARCHAR(10),
    name NVARCHAR(100),
    id_card NVARCHAR(20),
    department NVARCHAR(100),
    position NVARCHAR(100),
    email NVARCHAR(100),
    contact NVARCHAR(20),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
GO

-- 📑 documents table (✅ เพิ่ม pdf_file)
CREATE TABLE documents (
    id INT PRIMARY KEY IDENTITY(1,1),
    doc_number NVARCHAR(20) NOT NULL,
    doc_name NVARCHAR(100),
    subject NVARCHAR(255),
    department NVARCHAR(100),
    doc_date DATE,
    doc_time TIME,
    pdf_file VARBINARY(MAX)  -- ✅ สำหรับเก็บไฟล์ PDF
);
GO

-- 🔗 document_roles table
CREATE TABLE document_roles (
    id INT PRIMARY KEY IDENTITY(1,1),
    document_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
GO

-- 🌟 Insert roles
INSERT INTO roles (name)
VALUES 
('admin'),
('worker'),
('guest');
GO

-- 👥 Insert users
INSERT INTO users (username, password, role_id, token, image, name, id_card, department, position, email, contact)
VALUES
('admin', 'adminpass', 1, 'admin123', '1', N'นายสมชาย ใจดี', '123456', N'ฝ่ายการตลาด', N'ผู้จัดการ', 'somchai@example.com', '081-1234567'),
('worker', 'workerpass', 2, 'worker123', '2', N'นางสาวสวย ใจงาม', '789101', N'ฝ่ายการเงิน', N'เจ้าหน้าที่การเงิน', 'suay@example.com', '081-7654321'),
('user1', 'pass1', 2, 'token1', '3', N'นายจิตร จินดา', '112233', N'ฝ่ายบุคคล', N'เจ้าหน้าที่บุคคล', 'jit@example.com', '081-1122334'),
('user2', 'pass2', 2, 'token2', '4', N'นางสมหญิง หอมแก้ว', '445566', N'ฝ่ายบัญชี', N'เจ้าหน้าที่บัญชี', 'somying@example.com', '081-4455667'),
('user3', 'pass3', 2, 'token3', '5', N'นายวิทยา ชาญชัย', '778899', N'ฝ่ายไอที', N'โปรแกรมเมอร์', 'wittaya@example.com', '081-7788990');
GO

-- 📄 Insert documents
INSERT INTO documents (doc_number, doc_name, subject, department, doc_date, doc_time)
VALUES
('426333', N'รายงานปี2550', N'เอกสารรายงานประจำปี 2550', N'บัญชี', '2006-12-21', '14:12:00'),
('426334', N'รายงานปี2551', N'เอกสารรายงานประจำปี 2551', N'การเงิน', '2007-12-20', '15:20:00'),
('426335', N'รายงานปี2552', N'เอกสารรายงานประจำปี 2552', N'การเงิน', '2008-12-19', '16:30:00'),
('426336', N'รายงานปี2553', N'เอกสารรายงานประจำปี 2553', N'ทรัพยากรบุคคล', '2009-12-18', '17:40:00'),
('426337', N'รายงานปี2554', N'เอกสารรายงานประจำปี 2554', N'บัญชี', '2010-12-17', '18:50:00');
GO

-- 🔗 Insert document_roles
INSERT INTO document_roles (document_id, role_id) VALUES 
(1, 1), (1, 2),        -- doc 1 → admin, worker
(2, 1), (2, 2), (2, 3),-- doc 2 → admin, worker, guest
(3, 1), (3, 2),        -- doc 3 → admin, worker
(4, 1), (4, 2), (4, 3),-- doc 4 → admin, worker, guest
(5, 1);                -- doc 5 → admin only
GO
