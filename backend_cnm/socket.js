const { Server } = require("socket.io");
const fetch = require("node-fetch"); // Đảm bảo đã cài: npm i node-fetch@2

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected");

    // ✅ Gửi tin nhắn realtime + lưu vào DB
    socket.on("send_message", async (data) => {
      io.emit("receive_message", data);

      try {
        await fetch("http://localhost:5000/api/messages/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.error("❌ Lỗi lưu tin nhắn từ socket:", err.message);
      }
    });

    // ✅ Thu hồi tin nhắn: gửi API + emit tới 2 phía
    socket.on("recall_message", async (data) => {
      const { from, to, timestamp, index } = data;

      try {
        // Gửi yêu cầu thu hồi đến API
        const res = await fetch("http://localhost:5000/api/messages/recall", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from, to, timestamp }),
        });

        const result = await res.json();

        if (result.success) {
          // Gửi event realtime cho cả 2 phía
          io.emit("receive_message", {
            type: "recall",
            timestamp,
            from,
            to,
            index, // chỉ client dùng
          });
        }
      } catch (err) {
        console.error("❌ Lỗi khi recall tin nhắn:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected");
    });
  });
}

module.exports = initSocket;
