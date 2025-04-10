const {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const dynamodb = require("../db/aws");

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "users-zalolite";

// ✅ Chuẩn hoá định dạng số điện thoại (035xxx → +8435xxx)
const normalizePhone = (phone) => {
  if (!phone) return "";
  return phone.startsWith("+84") ? phone : phone.replace(/^0/, "+84");
};

// ✅ Đăng ký tài khoản
exports.registerUser = async (req, res) => {
  const { phone, password, name, avatar = "/default-avatar.png", status = "online" } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!phone || !password || !name) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
  }

  try {
    const check = await dynamodb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { phone: normalizedPhone, name }
    }));

    if (check.Item) {
      return res.status(409).json({ success: false, message: "Tài khoản đã tồn tại" });
    }

    await dynamodb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        phone: normalizedPhone,
        name,
        password,
        avatar,
        status,
        isPhoneVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));

    res.json({ success: true, message: "Đăng ký thành công!" });
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err);
    res.status(500).json({ success: false, message: "Đăng ký thất bại", error: err.message });
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
    const user = users.find(u => u.password === password);

    if (!user) {
      return res.status(401).json({ success: false, message: "SĐT hoặc mật khẩu không đúng" });
    }

    res.json({ success: true, message: "Đăng nhập thành công", user });
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

    res.json({ success: true, message: "Đặt lại mật khẩu thành công" });
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

// ✅ Upload ảnh đại diện
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

    res.json({ success: true, message: "Cập nhật ảnh đại diện thành công", avatar: avatarPath });
  } catch (err) {
    console.error("❌ Lỗi uploadAvatar:", err);
    res.status(500).json({ success: false, message: "Upload thất bại", error: err.message });
  }
};

// ✅ Lấy thông tin người dùng
exports.getUserByPhone = async (req, res) => {
  const { phone } = req.params;

  if (!phone) {
    return res.status(400).json({ success: false, message: "Thiếu số điện thoại" });
  }

  const normalizedPhone = phone.startsWith("+84") ? phone : phone.replace(/^0/, "+84");

  try {
    // ✅ Sử dụng Query thay vì GetCommand do có sort key (name)
    const result = await dynamodb.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "#p = :phone",
      ExpressionAttributeNames: {
        "#p": "phone",
      },
      ExpressionAttributeValues: {
        ":phone": normalizedPhone,
      },
    }));

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({ success: true, user: result.Items[0] });
  } catch (err) {
    console.error("❌ Lỗi lấy thông tin người dùng:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err.message });
  }
};

