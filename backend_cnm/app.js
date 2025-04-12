const express = require("express");
const http = require("http");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const friendRoutes = require("./routes/friends.routes");
const messageRoutes = require("./routes/message.routes");
const initSocket = require("./socket");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/messages", messageRoutes);

// Init socket
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
