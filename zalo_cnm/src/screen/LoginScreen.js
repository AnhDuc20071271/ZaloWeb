import React from "react";
import "./../css/LoginScreen.css";

function LoginScreen() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">Zalo</h1>
        <p className="login-subtext">
          Đăng nhập tài khoản Zalo <br /> để kết nối với ứng dụng Zalo Web
        </p>

        <div className="login-form">
          <h3 className="form-title">Đăng nhập với mật khẩu</h3>

          {/* Ô nhập số điện thoại */}
          <div className="input-group">
            <select className="country-code">
              <option value="+84">+84</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <input type="text" className="login-input" placeholder="Số điện thoại" />
          </div>

          {/* Ô nhập mật khẩu */}
          <div className="input-group">
            <input type="password" className="login-input" placeholder="Mật khẩu" />
          </div>

          {/* Nút đăng nhập */}
          <button className="login-button">Đăng nhập với mật khẩu</button>

          {/* Link quên mật khẩu */}
          <p className="forgot-password">Quên mật khẩu</p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
