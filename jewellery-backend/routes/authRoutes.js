// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");
// const { setOtp, getOtp, clearOtp } = require("../utils/otpStore");

// // ✅ Generate 6-digit OTP
// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // ✅ 1. Send OTP
// router.post("/send-otp", (req, res) => {
//   const { phone_number } = req.body;

//   if (!phone_number || phone_number.length !== 10) {
//     return res.status(400).json({ message: "Invalid phone number" });
//   }

//   const otp = generateOtp();
//   setOtp(phone_number, otp);

//   console.log(`📲 OTP for ${phone_number}: ${otp}`); // just log it for now

//   res.json({ message: "OTP sent successfully" });
// });

// // ✅ 2. Verify OTP and return user data if exists
// router.post("/verify-otp", (req, res) => {
//   const { phone, otp } = req.body;

//   console.log("🔔 Received verify-otp:", { phone, otp });

//   if (getOtp(phone) !== otp) {
//     console.log("❌ Invalid OTP");
//     return res.status(400).json({ message: "Invalid OTP" });
//   }

//   clearOtp(phone);

//   const query = "SELECT name, phone FROM users WHERE phone = ?";
//   db.query(query, [phone], (err, results) => {
//     if (err) {
//       console.error("❌ MySQL error:", err.message);
//       return res.status(500).json({ message: "Database error" });
//     }

//     console.log("🧪 Query Results:", results);

//     if (results.length > 0) {
//       const user = results[0];
//       console.log("✅ User found:", user);
//       return res.status(200).json({
//         name: user.name,
//         phone: user.number,
//         isNewUser: false
//       });
//     }

//     console.log("🆕 New user — not registered yet");
//     return res.status(200).json({
//       isNewUser: true
//     });
//   });
// });

// // ✅ 3. Register User (after verifying OTP)
// router.post("/register", (req, res) => {
//   const { name, number } = req.body;

//   if (!name || !number) {
//     return res.status(400).json({ message: "Name and phone number are required" });
//   }

//   const query = "INSERT INTO users (name, number) VALUES (?, ?)";
//   db.query(query, [name, number], (err, result) => {
//     if (err) {
//       console.error("❌ MySQL insert error:", err.message);
//       return res.status(500).json({ message: "Database insert failed" });
//     }

//     res.status(201).json({ message: "✅ User registered", userId: result.insertId });
//   });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { setOtp, getOtp, clearOtp } = require("../utils/otpStore");

// ✅ Helper: Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ 1. Send OTP
router.post("/send-otp", (req, res) => {
  const { phone } = req.body;

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  const otp = generateOtp();
  setOtp(phone, otp);

  // TODO: Integrate SMS API here
  console.log(`📲 OTP for ${phone}: ${otp}`);

  res.status(200).json({ message: "OTP sent successfully" });
});

// ✅ 2. Verify OTP and check user
router.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  console.log("📨 Request body:", req.body);

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  const storedOtp = getOtp(phone);
  console.log("Stored OTP:", storedOtp, "Entered OTP:", otp);
  if (!storedOtp || storedOtp !== otp) {
    console.log("❌ Invalid OTP attempt for:", phone);
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  clearOtp(phone);

  const query = "SELECT id, name FROM users WHERE phone = ?";
  db.query(query, [phone], (err, results) => {
    if (err) {
      console.error("❌ DB error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length > 0) {
      const user = results[0];
      return res.status(200).json({
        // name: user.name,
        // phone: user.phone,
        isNewUser: false,
        user: results[0],
        phone: results[0].phone,
      });
    }

    return res.status(200).json({ isNewUser: true });
  });
});

// ✅ 3. Register User
// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, phone } = req.body;

  if (!name || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Valid name and phone required" });
  }

  const query =
    "INSERT INTO users (name, phone, created_at) VALUES (?, ?, NOW())";
  db.query(query, [name, phone], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "User already exists" });
      }
      return res.status(500).json({ message: "Database insert failed" });
    }

    const user = { id: result.insertId, name, phone };
    return res.status(201).json({ message: "User registered", user });
  });
});

module.exports = router;
