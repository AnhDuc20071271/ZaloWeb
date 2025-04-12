import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../css/LoginScreen.css";

function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Kiểm tra SĐT hợp lệ (0xxx... hoặc +84xxx...)
  const isValidPhone = (phone) => /^0\d{9}$/.test(phone) || /^\+84\d{9}$/.test(phone);

  // ✅ Chuẩn hóa về dạng: 84xxxxxxxxx (không dấu +)
  const normalizePhone = (phone) => {
    if (phone.startsWith("+84")) return phone.replace("+84", "84");
    return phone.replace(/^0/, "84");
  };

  const handleLogin = async () => {
    if (!isValidPhone(phone)) {
      alert("Số điện thoại không hợp lệ. Nhập theo định dạng 0xxxxxxxxx hoặc +84xxxxxxxxx");
      return;
    }

    if (!password) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    const normalizedPhone = normalizePhone(phone);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        phone: normalizedPhone,
        password,
      });

      if (res.data.success) {
        alert("Đăng nhập thành công!");
        sessionStorage.setItem("phone", normalizedPhone);
        navigate("/home");
      } else {
        alert("Đăng nhập thất bại: " + res.data.message);
      }
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">Zalo</h1>
        <p className="login-subtext">
          Đăng nhập tài khoản Zalo <br /> để kết nối với ứng dụng Zalo Web
        </p>

        <div className="login-form">
          <h3 className="form-title">Đăng nhập với mật khẩu</h3>

          <div className="input-group">
            <input
              type="text"
              className="login-input"
              placeholder="Số điện thoại (vd: 0357695485)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              className="login-input"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-button" onClick={handleLogin}>
            Đăng nhập
          </button>

          <div className="login-links">
            <p className="register-link">
              Chưa có tài khoản? <span onClick={() => navigate("/register")}>Đăng ký</span>
            </p>
            <p className="forgot-password" onClick={() => navigate("/forgot-password")}>
              Quên mật khẩu?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
