const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "day-la-khoa-bi-mat-cua-du-an-123"; // Key bảo mật

// 1. ĐĂNG KÝ
router.post("/register", async (req, res) => {
  try {
    const { username, password, fullName } = req.body;

    // Kiểm tra trùng user
    const existUser = await User.findOne({ username });
    if (existUser) return res.status(400).json({ message: "Tài khoản đã tồn tại!" });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, fullName });
    await newUser.save();

    res.json({ message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ĐĂNG NHẬP
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Tìm user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

    // Tạo Token + Gửi kèm Role
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });

    res.json({ 
      message: "Đăng nhập thành công", 
      token, 
      username: user.username,
      role: user.role 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;