const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes"); // import route
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
