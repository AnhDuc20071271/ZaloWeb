// ✅ LoginScreen.js – Có thêm nút Đăng ký & Quên mật khẩu

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../css/LoginScreen.css";

function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!phone || !password) {
      alert("Vui lòng nhập đầy đủ số điện thoại và mật khẩu");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        phone,
        password,
      });

      if (res.data.success) {
        alert("Đăng nhập thành công!");
        navigate("/home");
      } else {
        alert("Đăng nhập thất bại: " + res.data.message);
      }
    } catch (err) {
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
              placeholder="Số điện thoại (vd: +841234567)"
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

          {/* Đăng ký và Quên mật khẩu */}
                      <div className="login-links">
              <p className="register-link">
                Chưa có tài khoản?{" "}
                <span onClick={() => navigate("/register")}>Đăng ký</span>
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