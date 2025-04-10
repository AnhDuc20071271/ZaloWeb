// ✅ ForgotPasswordScreen.js – Cho phép nhập SĐT dạng 035xxxxxxx và tự động chuyển sang +84 khi gửi OTP
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
import axios from "axios";
import "./../css/ForgotPasswordScreen.css";

function ForgotPasswordScreen() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("form");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const convertToIntlPhone = (vnPhone) => {
    if (vnPhone.startsWith("0")) {
      return "+84" + vnPhone.slice(1);
    }
    return vnPhone;
  };

  const isValidVNPhone = (phone) => /^0\d{9}$/.test(phone);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => console.log("reCAPTCHA solved"),
      });
    }
  };

  const handleSendOTP = async () => {
    if (!isValidVNPhone(phone)) {
      alert("SĐT không hợp lệ. Dạng: 0xxxxxxxxx");
      return;
    }

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, convertToIntlPhone(phone), appVerifier);
      setConfirmationResult(result);
      setStep("otp");
      alert("Mã OTP đã gửi đến SĐT của bạn!");
    } catch (err) {
      console.error("Gửi OTP lỗi:", err);
      alert("Không thể gửi OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await confirmationResult.confirm(otp);
      setStep("reset");
    } catch (err) {
      alert("OTP không đúng hoặc đã hết hạn");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        phone,
        newPassword,
      });

      alert("Mật khẩu đã được đặt lại thành công!");
      navigate("/");
    } catch (err) {
      alert("Đặt lại mật khẩu thất bại");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h1>Quên mật khẩu</h1>

        {step === "form" && (
          <>
            <input
              type="text"
              placeholder="SĐT dạng 035..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={handleSendOTP}>Gửi mã OTP</button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOTP}>Xác thực OTP</button>
          </>
        )}

        {step === "reset" && (
          <>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleResetPassword}>Cập nhật mật khẩu</button>
          </>
        )}
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
}

export default ForgotPasswordScreen;