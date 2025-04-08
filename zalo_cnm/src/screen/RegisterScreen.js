// ✅ RegisterScreen.js hoàn chỉnh – có thêm nút quay về đăng nhập

import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
import axios from "axios";
import "./../css/RegisterScreen.css";
import { useNavigate } from "react-router-dom";

function RegisterScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const isValidPhone = (phone) => /^\+84\d{9}$/.test(phone);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved", response);
          },
          "expired-callback": () => {
            console.warn("reCAPTCHA expired. Resetting...");
          },
        }
      );
    }
  };

  const handleSendOTP = async () => {
    if (!isValidPhone(phone)) {
      alert("Số điện thoại không hợp lệ. Nhập dạng +84xxxxxxxxx");
      return;
    }

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
      alert("Đã gửi mã xác thực về số điện thoại của bạn!");
    } catch (err) {
      console.error("Lỗi gửi OTP:", err);
      alert("Không gửi được OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await confirmationResult.confirm(otp);
      await axios.post("http://localhost:5000/api/auth/register", {
        phone,
        password,
      });
      alert("Đăng ký thành công!");
      navigate("/");
    } catch (err) {
      console.error("Lỗi xác thực OTP:", err);
      alert("Mã OTP không đúng hoặc đã hết hạn");
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="register-box">
          <h1 className="logo">Zalo</h1>
          <p className="register-subtext">Tạo tài khoản Zalo để kết nối với bạn bè</p>

          {step === "form" && (
            <>
              <div className="input-group">
                <input
                  type="text"
                  className="register-input"
                  placeholder="Số điện thoại (vd: +8412345678)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  className="register-input"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="register-button" onClick={handleSendOTP}>
                Đăng ký
              </button>
              <p>Bạn có tài khoản?</p>
              <p className="back-to-login" onClick={() => navigate("/")}> Đăng nhập</p>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="input-group">
                <input
                  type="text"
                  className="register-input"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button className="register-button" onClick={handleVerifyOTP}>
                Xác nhận mã OTP & Đăng ký
              </button>
              <p className="back-to-login" onClick={() => navigate("/")}>⬅ Quay về đăng nhập</p>
            </>
          )}
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  );
}

export default RegisterScreen;
