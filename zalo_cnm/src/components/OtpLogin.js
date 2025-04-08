import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
import { useNavigate } from "react-router-dom";

function OtpLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved:", response);
        },
      });
    }
  };

  const handleSendOTP = async () => {
    if (!phone.startsWith("+84")) {
      alert("Vui lòng nhập số điện thoại định dạng quốc tế (+84...)");
      return;
    }

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      alert("✅ Mã OTP đã được gửi!");
    } catch (error) {
      console.error("❌ Gửi OTP thất bại:", error);
      alert("Không gửi được mã OTP");
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult) return alert("Bạn chưa gửi OTP");

    try {
      await confirmationResult.confirm(otp);
      alert("🎉 Xác thực OTP thành công!");

      // 👉 Sau xác thực, bạn có thể chuyển trang hoặc gọi API backend tại đây
      // Ví dụ: navigate("/register-info"); hoặc gọi API lưu user
      navigate("/home");

    } catch (error) {
      console.error("❌ Xác thực thất bại:", error);
      alert("Mã OTP không đúng hoặc đã hết hạn!");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>🔐 Xác thực số điện thoại bằng OTP</h2>

      <input
        type="text"
        placeholder="Số điện thoại (vd: +84357695485)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ marginBottom: "10px", padding: "10px", width: "300px" }}
      />
      <br />
      <button onClick={handleSendOTP}>Gửi mã OTP</button>

      <br /><br />

      <input
        type="text"
        placeholder="Nhập mã OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{ marginBottom: "10px", padding: "10px", width: "300px" }}
      />
      <br />
      <button onClick={handleVerifyOTP}>Xác minh OTP</button>

      {/* ReCAPTCHA sẽ được render ẩn ở đây */}
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default OtpLogin;
