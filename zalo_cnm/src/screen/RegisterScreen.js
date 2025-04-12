import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
import axios from "axios";
import "./../css/RegisterScreen.css";
import { useNavigate } from "react-router-dom";

function RegisterScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  // ✅ Hợp lệ: 0xxx hoặc +84xxx
  const isValidPhone = (phone) => /^(\+84|0)\d{9}$/.test(phone);

  // ✅ Firebase cần định dạng quốc tế +84
  const convertToInternational = (phone) =>
    phone.startsWith("+84") ? phone : phone.replace(/^0/, "+84");

  // ✅ Backend cần: 84xxx (loại bỏ +)
  const convertToBackendPhone = (phone) =>
    phone.startsWith("+84") ? phone.replace("+84", "84") : phone.replace(/^0/, "84");

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
  };

  const handleSendOTP = async () => {
    if (!isValidPhone(phone) || !name || !password) {
      alert("Vui lòng nhập đầy đủ tên, SĐT và mật khẩu");
      return;
    }

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const internationalPhone = convertToInternational(phone);
      const result = await signInWithPhoneNumber(auth, internationalPhone, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
      alert("Đã gửi mã OTP!");
    } catch (err) {
      console.error("❌ Lỗi gửi OTP:", err);
      alert("Không gửi được OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await confirmationResult.confirm(otp);
      const backendPhone = convertToBackendPhone(phone);

      await axios.post("http://localhost:5000/api/auth/register", {
        phone: backendPhone,
        password,
        name,
        avatar: "/default-avatar.png",
        status: "online",
      });

      alert("✅ Đăng ký thành công!");
      navigate("/");
    } catch (err) {
      console.error("❌ Xác thực OTP lỗi:", err);
      alert("OTP sai hoặc đã hết hạn");
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
                  placeholder="Tên hiển thị"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="register-input"
                  placeholder="Số điện thoại (VD: 035xxx hoặc +8435xxx)"
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
              <button className="register-button" onClick={handleSendOTP}>Đăng ký</button>
              <p className="back-to-login" onClick={() => navigate("/")}>⬅ Quay về đăng nhập</p>
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
            </>
          )}
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  );
}

export default RegisterScreen;
