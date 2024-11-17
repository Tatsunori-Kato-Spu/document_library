// users.jsx

const users = [
  { user: "admin", pass: "adminpass", role: "admin", token: "admin123" },
  { user: "worker", pass: "workerpass", role: "worker", token: "worker123" }
];

export function verifyUser(user, pass) {
  // ตรวจสอบกรณีของ User ที่กรอกสำหรับ Admin และ Worker
  const userFound = users.find((u) => u.user === user && u.pass === pass);
  return userFound ? { role: userFound.role, token: userFound.token } : null;
}

export function verifyGuestLogin() {
  // สำหรับ Guest ที่ไม่ต้องกรอกข้อมูล
  return { role: "guest", token: "guest123" };
}
