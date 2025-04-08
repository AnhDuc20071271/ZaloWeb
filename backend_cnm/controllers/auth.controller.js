// ✅ controllers/auth.controller.js – Xử lý đăng ký, gửi OTP (Firebase), xác thực OTP, đăng nhập SQL Server

const sql = require("mssql");
const db = require("../db/sql");

// ✅ Đăng ký người dùng
exports.registerUser = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: "Thiếu số điện thoại hoặc mật khẩu" });
  }

  try {
    const pool = await db;
    await pool.request()
      .input("phone", sql.VarChar, phone)
      .input("password", sql.VarChar, password)
      .query("INSERT INTO Users (Phone, Password) VALUES (@phone, @password)");

    res.json({ success: true, message: "Đăng ký thành công!" });
  } catch (err) {
    console.error("Lỗi khi ghi vào DB:", err);
    res.status(500).json({ success: false, message: "Đăng ký thất bại", error: err });
  }
};

// ✅ Đăng nhập người dùng
exports.loginUser = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: "Thiếu số điện thoại hoặc mật khẩu" });
  }

  try {
    const pool = await db;
    const result = await pool.request()
      .input("phone", sql.VarChar, phone)
      .input("password", sql.VarChar, password)
      .query("SELECT * FROM Users WHERE Phone = @phone AND Password = @password");

    if (result.recordset.length > 0) {
      res.json({ success: true, message: "Đăng nhập thành công", user: result.recordset[0] });
    } else {
      res.status(401).json({ success: false, message: "SĐT hoặc mật khẩu không đúng" });
    }
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err });
  }
};
// ✅ Đặt lại mật khẩu người dùng (dùng sau khi xác thực OTP Firebase thành công)
exports.resetPassword = async (req, res) => {
    const { phone, newPassword } = req.body;
  
    if (!phone || !newPassword) {
      return res.status(400).json({ success: false, message: "Thiếu số điện thoại hoặc mật khẩu mới" });
    }
  
    try {
      const pool = await db;
  
      const result = await pool.request()
        .input("phone", sql.VarChar, phone)
        .input("newPassword", sql.VarChar, newPassword)
        .query("UPDATE Users SET Password = @newPassword WHERE Phone = @phone");
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
      }
  
      res.json({ success: true, message: "Cập nhật mật khẩu thành công!" });
    } catch (err) {
      console.error("Lỗi cập nhật mật khẩu:", err);
      res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err });
    }
  };
  