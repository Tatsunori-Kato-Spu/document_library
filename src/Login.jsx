import { useRef } from "react";
import Form from "react-bootstrap/Form";
import { verifyUser } from "./data/users.jsx";  // ถ้าไฟล์อยู่ใน src/data/users.js

import "./Login.css";

function Login({ onLoginSuccess }) {
  const userRef = useRef();
  const passRef = useRef();

  const handleLogin = () => {
    const user = userRef.current.value.trim();
    const pass = passRef.current.value.trim();
    userRef.current.value = "";
    passRef.current.value = "";

    const userInfo = verifyUser(user, pass);
    if (userInfo === null) {
      alert("User not found");
      userRef.current.focus();
    } else {
      onLoginSuccess(); // เรียกฟังก์ชันนี้เมื่อเข้าสู่ระบบสำเร็จ
    }
  };

  const handleGuestLogin = () => {
    alert("Logged in as Guest");
    onLoginSuccess(); // ให้เข้าสู่ระบบเหมือนกัน
  };

  return (
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
          >
            Sign In with Guest
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
