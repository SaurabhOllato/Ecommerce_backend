const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { setOtp, getOtp, clearOtp } = require("../utils/otpStore");

// ✅ Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ 1. Send OTP
router.post("/send-otp", (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number || phone_number.length !== 10) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  const otp = generateOtp();
  setOtp(phone_number, otp);

  console.log(`📲 OTP for ${phone_number}: ${otp}`); // just log it for now

  res.json({ message: "OTP sent successfully" });
});

// ✅ 2. Verify OTP
router.post("/verify-otp", (req, res) => {
  const { phone_number, otp } = req.body;

  if (getOtp(phone_number) === otp) {
    clearOtp(phone_number);
    return res.json({ message: "OTP verified successfully" });
  }

  res.status(400).json({ message: "Invalid OTP" });
});

// ✅ 3. Register User (after verifying OTP)
router.post("/register", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ message: "Name and phone number are required" });
  }

  const query = "INSERT INTO users (name, number) VALUES (?, ?)";
  db.query(query, [name, number], (err, result) => {
    if (err) {
      console.error("❌ MySQL insert error:", err.message);
      return res.status(500).json({ message: "Database insert failed" });
    }

    res.status(201).json({ message: "✅ User registered", userId: result.insertId });
  });
});

module.exports = router;
