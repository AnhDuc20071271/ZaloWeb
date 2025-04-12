// controllers/message.controller.js
const { PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const dynamodb = require("../db/aws");
const path = require("path");
const fs = require("fs");
const TABLE_NAME = "Messages";
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb"); 

// Tạo chatId duy nhất giữa 2 người
const generateChatId = (userA, userB) => {
    return [userA, userB].sort().join("_");
  };
  

// Gửi tin nhắn
exports.sendMessage = async (req, res) => {
  const { from, to, message, type = "text" } = req.body;

  if (!from || !to || !message) {
    return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
  }

  const chatId = generateChatId(from, to);
  const timestamp = Date.now();

  const item = {
    chatId,
    timestamp,
    from,
    to,
    message,
    type,
    seen: false,
    messageId: uuidv4(),
  };

  try {
    await dynamodb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    res.json({ success: true, message: "Đã gửi tin nhắn", data: item });
  } catch (err) {
    console.error("Lỗi sendMessage:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err.message });
  }
};

// Lấy tất cả tin nhắn giữa 2 người
exports.getMessages = async (req, res) => {
  const { userA, userB } = req.query;

  if (!userA || !userB) {
    return res.status(400).json({ success: false, message: "Thiếu số điện thoại" });
  }

  const chatId = generateChatId(userA, userB);

  try {
    const result = await dynamodb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "chatId = :chatId",
        ExpressionAttributeValues: {
          ":chatId": chatId,
        },
        ScanIndexForward: true, // Tăng dần theo thời gian
      })
    );

    res.json({ success: true, messages: result.Items });
  } catch (err) {
    console.error("Lỗi getMessages:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err.message });
  }
};
exports.uploadFile = async (req, res) => {
    const { from, to } = req.body;
    const file = req.file;
  
    if (!from || !to || !file) {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
    }
  
    const chatId = generateChatId(from, to);
    const filePath = `uploads/${Date.now()}-${file.originalname}`;
  
    fs.writeFileSync(filePath, file.buffer);
  
    const message = {
      chatId,
      timestamp: Date.now().toString(),
      from,
      to,
      type: "file",
      message: filePath, // hoặc link S3 nếu dùng cloud
      messageId: uuidv4(),
      seen: false,
    };
  
    try {
      await dynamodb.send(new PutCommand({ TableName: "Messages", Item: message }));
      res.json({ success: true, message });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
  exports.sendFile = async (req, res) => {
    const { from, to } = req.body;
    const file = req.file;
  
    if (!from || !to || !file) {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
    }
  
    const chatId = generateChatId(from, to);
    const timestamp = Date.now();
  
    const item = {
      chatId,
      timestamp,
      from,
      to,
      message: file.originalname,
      type: "file",
      url: `/uploads/files/${file.filename}`,
    };
  
    try {
      await dynamodb.send(new PutCommand({ TableName: "Messages", Item: item }));
      res.json({ success: true, message: "File đã gửi", data: item });
    } catch (err) {
      console.error("❌ Lỗi lưu file:", err);
      res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
    }
  };
  exports.recallMessage = async (req, res) => {
    const { from, to, timestamp } = req.body;
  
    if (!from || !to || !timestamp) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }
  
    const chatId = generateChatId(from, to); // 🔑 vì bạn dùng chatId làm Partition Key
  
    try {
      await dynamodb.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: {
            chatId,
            timestamp: Number(timestamp),
          },
          UpdateExpression: "SET #msg = :recall, #type = :type",
          ExpressionAttributeNames: {
            "#msg": "message",
            "#type": "type",
          },
          ExpressionAttributeValues: {
            ":recall": "__RECALLED__",
            ":type": "recall",
          },
        })
      );
  
      return res.json({ success: true, message: "Thu hồi thành công" });
    } catch (error) {
      console.error("Recall Error:", error);
      return res.status(500).json({ error: "Lỗi thu hồi tin nhắn", detail: error.message });
    }
  };