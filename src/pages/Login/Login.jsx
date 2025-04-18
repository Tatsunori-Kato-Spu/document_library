import { useRef } from "react";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import Headerprofile from "../../Layout/Header/Headerprofile";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const userRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const username = userRef.current.value;
    const password = passRef.current.value;
  
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
  
      if (res.ok && data.success) {
        console.log("✅ userInfo:", data.userInfo);
  
        // ✅ บันทึกข้อมูลลง LocalStorage
        localStorage.setItem("username", data.userInfo.username);
        localStorage.setItem("role", data.userInfo.role);
        localStorage.setItem("token", data.userInfo.token);
  
        await Swal.fire({
          title: "Welcome!",
          text: `ยินดีต้อนรับ, ${data.userInfo.name || data.userInfo.username}`,
          icon: "success",
          confirmButtonText: "Proceed",
        });
  
        onLoginSuccess({
          ...data.userInfo,
          token: data.userInfo.token,
        });
  
        navigate("/document_library/pagedoc"); // ✅ เปลี่ยนหน้าได้แน่นอน
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Login failed!",
          icon: "error",
          confirmButtonText: "Try Again",
        });
        userRef.current.focus();
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        title: "Error!",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleGuestLogin = () => {
    const guestInfo = {
      username: "guest",
      role: "guest",
      name: "Guest User",
    };

    // ✅ บันทึก Guest ลงใน LocalStorage
    localStorage.setItem("username", guestInfo.username);
    localStorage.setItem("role", guestInfo.role);

    Swal.fire({
      title: "Logged In!",
      text: "Logged in as Guest",
      icon: "info",
      confirmButtonText: "OK",
    }).then(() => {
      onLoginSuccess(guestInfo);
      navigate("/document_library/pagedoc");
    });
  };

  return (
    <>
      <Headerprofile />
      <div className="Login-container">
        <div className="logo-container">
          <img
            src="/document_library/logo-login.png"
            alt="Login Logo"
            className="login-logo"
          />
        </div>

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
