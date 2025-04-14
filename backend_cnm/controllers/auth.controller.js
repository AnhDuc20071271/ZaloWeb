const {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const dynamodb = require("../db/aws");

const bcrypt = require("bcrypt");

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "users-zalolite";

// ✅ Chuyển 035xxx hoặc +8435xxx → 8435xxx
const normalizePhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/^0/, "84").replace(/^\+84/, "84");
};

// ✅ Đăng ký
exports.registerUser = async (req, res) => {
  const { phone, password, name } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!phone || !password || !name) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin" });
  }

  try {
    // Kiểm tra đã tồn tại
    const check = await dynamodb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { phone: normalizedPhone, name }
    }));

    if (check.Item) {
      return res.status(409).json({ success: false, message: "Người dùng đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dynamodb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        phone: normalizedPhone,
        name,
        password: hashedPassword,
        avatar: "/default.png",
        status: "online"
      }
    }));

    res.json({ success: true, message: "Đăng ký thành công" });
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err.message });
  }
};

// ✅ Đăng nhập
exports.loginUser = async (req, res) => {
  const { phone, password } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: "Thiếu SĐT hoặc mật khẩu" });
  }

  try {
    const result = await dynamodb.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "phone = :p",
      ExpressionAttributeValues: {
        ":p": normalizedPhone
      }
    }));

    const users = result.Items || [];

    // ⚠️ Tìm user theo phone, sau đó so sánh bằng bcrypt
    let userMatch = null;
    for (const user of users) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        userMatch = user;
        break;
      }
    }

    if (!userMatch) {
      return res.status(401).json({ success: false, message: "SĐT hoặc mật khẩu không đúng" });
    }

    res.json({ success: true, message: "Đăng nhập thành công", user: userMatch });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err.message });
  }
};

// ✅ Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
  const { phone, name, newPassword } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!phone || !name || !newPassword) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin" });
  }

  try {
    await dynamodb.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { phone: normalizedPhone, name },
      UpdateExpression: "SET password = :pw, updatedAt = :now",
      ExpressionAttributeValues: {
        ":pw": newPassword,
        ":now": new Date().toISOString()
      }
    }));

    res.json({ success: true, message: "Cập nhật mật khẩu thành công" });
  } catch (err) {
    console.error("❌ Lỗi resetPassword:", err);
    res.status(500).json({ success: false, message: "Cập nhật thất bại", error: err.message });
  }
};

// ✅ Cập nhật hồ sơ
exports.updateProfile = async (req, res) => {
  const { phone, name, status } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!phone || !name) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin" });
  }

  try {
    await dynamodb.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { phone: normalizedPhone, name },
      UpdateExpression: "SET #s = :status, updatedAt = :now",
      ExpressionAttributeNames: {
        "#s": "status"
      },
      ExpressionAttributeValues: {
        ":status": status || "",
        ":now": new Date().toISOString()
      }
    }));

    res.json({ success: true, message: "Cập nhật hồ sơ thành công" });
  } catch (err) {
    console.error("❌ Lỗi updateProfile:", err);
    res.status(500).json({ success: false, message: "Cập nhật thất bại", error: err.message });
  }
};

// ✅ Upload avatar
exports.uploadAvatar = async (req, res) => {
  const { phone, name } = req.body;
  const file = req.file;
  const normalizedPhone = normalizePhone(phone);

  if (!phone || !name || !file) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin" });
  }

  const avatarPath = `/uploads/${file.filename}`;

  try {
    await dynamodb.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { phone: normalizedPhone, name },
      UpdateExpression: "SET avatar = :avatar, updatedAt = :now",
      ExpressionAttributeValues: {
        ":avatar": avatarPath,
        ":now": new Date().toISOString()
      }
    }));

    res.json({ success: true, message: "Cập nhật avatar thành công", avatar: avatarPath });
  } catch (err) {
    console.error("❌ Lỗi uploadAvatar:", err);
    res.status(500).json({ success: false, message: "Upload thất bại", error: err.message });
  }
};

// ✅ Lấy thông tin người dùng theo phone
exports.getUserByPhone = async (req, res) => {
  const { phone } = req.params;
  const normalizedPhone = normalizePhone(phone);

  try {
    const result = await dynamodb.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "phone = :p",
      ExpressionAttributeValues: {
        ":p": normalizedPhone
      }
    }));

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({ success: true, user: result.Items[0] });
  } catch (err) {
    console.error("❌ Lỗi getUserByPhone:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err.message });
  }
};
