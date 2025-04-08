const fs = require("fs");
const path = require("path");
const sql = require("mssql");
const db = require("../db/sql");

exports.updateAvatar = async (req, res) => {
  const { phone } = req.body;
  const avatar = req.file?.filename;

  if (!avatar || !phone) {
    return res.status(400).json({ success: false, message: "Thiếu dữ liệu." });
  }

  try {
    const pool = await db;

    // ❌ Xóa ảnh cũ nếu có
    const result = await pool.request()
      .input("phone", sql.VarChar, phone)
      .query("SELECT Avatar FROM Profiles WHERE Phone = @phone");

    const oldAvatar = result.recordset[0]?.Avatar;
    if (oldAvatar) {
      const filePath = path.join(__dirname, "..", "uploads", oldAvatar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // ✅ Cập nhật ảnh mới
    await pool.request()
      .input("phone", sql.VarChar, phone)
      .input("avatar", sql.VarChar, avatar)
      .query("UPDATE Profiles SET Avatar = @avatar WHERE Phone = @phone");

    res.json({ success: true, avatar });
  } catch (err) {
    console.error("Lỗi update avatar:", err);
    res.status(500).json({ success: false, message: "Cập nhật thất bại." });
  }
};
