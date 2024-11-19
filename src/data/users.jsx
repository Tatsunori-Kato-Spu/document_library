const users = [
  {
    user: "admin",
    pass: "adminpass",
    role: "admin",
    token: "admin123",
    profilePic: "admin.jpg", // รูปภาพ
    firstName: "John", // ชื่อ
    lastName: "Doe", // สกุล
    employeeId: "EMP001", // หมายเลขพนักงาน
    department: "IT", // หน่วยงาน
    position: "System Administrator", // ตำแหน่ง
    email: "admin@example.com", // Email
    mobile: "0123456789" // เบอร์มือถือ
  },
  {
    user: "worker",
    pass: "workerpass",
    role: "worker",
    token: "worker123",
    profilePic: "worker.jpg", // รูปภาพ
    firstName: "Jane", // ชื่อ
    lastName: "Smith", // สกุล
    employeeId: "EMP002", // หมายเลขพนักงาน
    department: "Maintenance", // หน่วยงาน
    position: "Technician", // ตำแหน่ง
    email: "worker@example.com", // Email
    mobile: "0987654321" // เบอร์มือถือ
  }
];

// ฟังก์ชันตรวจสอบการเข้าสู่ระบบสำหรับ admin, worker
export function verifyUser(user, pass) {
  const userFound = users.find((u) => u.user === user && u.pass === pass);
  return userFound ? { role: userFound.role, token: userFound.token } : null;
}

// ฟังก์ชันเข้าสู่ระบบในฐานะ guest (ไม่ต้องกรอกข้อมูล)
export function verifyGuestLogin() {
  return { role: "guest", token: "guest123" };
}

// ฟังก์ชันตรวจสอบบทบาทของผู้ใช้เพื่อให้แสดงเอกสารที่เหมาะสม
export function canViewDocument(userRole, documentRoles) {
  // ตรวจสอบว่า userRole อยู่ใน roles ของเอกสารหรือไม่
  return documentRoles.includes(userRole);
}
