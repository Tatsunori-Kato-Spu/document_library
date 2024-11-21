import { useRef } from "react";
import Form from "react-bootstrap/Form";
import { verifyUser, verifyGuestLogin } from "../../data/userdata"; // ดึงฟังก์ชันมาใช้
import "./Login.css";
import Swal from "sweetalert2";
import Headerprofile from "../../Layout/Header/Headerprofile";

function Login({ onLoginSuccess }) {
  const userRef = useRef();
  const passRef = useRef();

  const handleLogin = () => {
    const user = userRef.current.value;
    const pass = passRef.current.value;

    const userInfo = verifyUser(user, pass); // ตรวจสอบ user และ password

    if (userInfo === null) {
      Swal.fire({
        title: "Error!",
        text: "รหัสผ่านไม่ถูกต้อง!",
        icon: "error",
        confirmButtonText: "Try Again",
      });
      userRef.current.focus();
    } else {
      Swal.fire({
        title: "Welcome!",
        text: `ยินดีต้อนรับ, ${userInfo.role}!`,
        icon: "success",
        confirmButtonText: "Proceed",
      }).then(() => {
        onLoginSuccess(userInfo); // ส่งข้อมูล userInfo หลังจากเข้าสู่ระบบ
      });
    }
  };

  const handleGuestLogin = () => {
    const guestInfo = verifyGuestLogin();
    Swal.fire({
      title: "Logged In!",
      text: "Logged in as Guest",
      icon: "info",
      confirmButtonText: "OK",
    }).then(() => {
      onLoginSuccess(guestInfo); // ส่ง guestInfo ไป
    });
  };

  return (
    <>
      <Headerprofile />
      <div className="Login-container">
        {/* โลโก้ */}
        <div className="logo-container">
          <img
            src="/logo-login.png" // โลโก้ใน public directory
            alt="Login Logo"
            className="login-logo"
          />
        </div>

        {/* ฟอร์ม */}
        <form>
          <Form.Control
            type="text"
            id="username"
            placeholder="Username"
            ref={userRef}
            className="input-field"
          />
          <Form.Control
            type="password"
            id="password"
            placeholder="Password"
            ref={passRef}
            className="input-field"
          />

          <div className="button-container">
            <button className="btn-login" onClick={handleLogin} type="button">
              Login
            </button>
            <button
              className="guest-button"
              onClick={handleGuestLogin}
              type="button"
            >
              Sign In as Guest
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
