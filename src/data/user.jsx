export const usersdata = [
  {
      "user": "admin",
      "pass": "adminpass",
      "role": "admin",
      "token": "admin123",
      "รูป": "1" ,
      "ชื่อ": "นายสมชาย ใจดี",
      "รหัสประจำตัว": "123456",
      "หน่วยงาน": "ฝ่ายการตลาด",
      "ตำแหน่ง": "ผู้จัดการ",
      "Email": "somchai@example.com",
      "ติดต่อ": "081-1234567"
  },
  {
      "user": "worker",
      "pass": "workerpass",
      "role": "worker",
      "token": "worker123",
      "รูป": "2",
      "ชื่อ": "นางสาวสวย ใจงาม",
      "รหัสประจำตัว": "789101",
      "หน่วยงาน": "ฝ่ายการเงิน",
      "ตำแหน่ง": "เจ้าหน้าที่การเงิน",
      "Email": "suay@example.com",
      "ติดต่อ": "081-7654321",
  }
]

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
