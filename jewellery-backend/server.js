// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const db = require("./config/db"); // ✅ For MySQL connection (assumes you’re calling this file for connection)
const authRoutes = require("./routes/authRoutes"); // ✅ Your route file
const productRoutes = require("./routes/productRoutes"); // ✅ Your route file

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json()); // ✅ Required to parse JSON from Postman or frontend

// ✅ MongoDB Connection (optional if not used for users)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

console.log("Mongo URI:", process.env.MONGO_URI); // optional debug

// ✅ Routes
app.use("/api/auth", authRoutes); // this makes /register => /api/auth/register
app.use("/api/products", productRoutes); // this makes /register => /api/auth/register
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
// 🟢 Start Server
app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
