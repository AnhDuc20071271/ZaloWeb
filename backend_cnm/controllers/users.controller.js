const { BatchGetCommand } = require("@aws-sdk/lib-dynamodb");
const dynamodb = require("../db/aws");

exports.getUsersByPhones = async (req, res) => {
  const { phones } = req.body; // expect array
  if (!phones || !Array.isArray(phones)) {
    return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ" });
  }

  try {
    const keys = phones.map(phone => ({ phone }));
    const result = await dynamodb.send(
      new BatchGetCommand({
        RequestItems: {
          "users-zalolite": {
            Keys: keys
          }
        }
      })
    );

    const users = result.Responses["users-zalolite"];
    res.json({ success: true, users });
  } catch (err) {
    console.error("Lỗi lấy user theo phone:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err.message });
  }
};
