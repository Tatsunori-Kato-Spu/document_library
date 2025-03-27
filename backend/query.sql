USE userdocs;
GO

-- ดูรายชื่อตารางทั้งหมด
SELECT * 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';

-- ดึงข้อมูลจากตาราง (แก้เป็นชื่อตารางจริง)
SELECT TOP 10 * 
FROM YourTableName;
