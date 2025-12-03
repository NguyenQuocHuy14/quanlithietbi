// routes/deviceRoutes.js
const express = require("express");
const router = express.Router();
const Device = require("../models/Device");
const multer = require("multer");
const path = require("path");

// Cấu hình multer lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Chỉ chấp nhận file ảnh (jpg, png, gif, webp)!"));
  }
});

// Lấy danh sách thiết bị
router.get("/", async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm thiết bị mới (có ảnh)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, category, location } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newDevice = new Device({
      name,
      category,
      location: location || "",
      image,
      status: "available"
    });

    await newDevice.save();
    res.json({ message: "Thêm thiết bị thành công", device: newDevice });
  } catch (err) {
    console.error("Lỗi thêm thiết bị:", err);
    res.status(400).json({ error: err.message });
  }
});

// CẬP NHẬT THIẾT BỊ – ĐÃ FIX HOÀN CHỈNH (hỗ trợ quantity + description + ảnh mới)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, quantity, description } = req.body;

    // Kiểm tra tên bắt buộc
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Tên thiết bị không được để trống!" });
    }

    const updateData = {
      name: name.trim(),
      quantity: parseInt(quantity) || 0,
      description: description || "",
    };

    // Nếu có ảnh mới → cập nhật ảnh
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedDevice) {
      return res.status(404).json({ error: "Không tìm thấy thiết bị" });
    }

    res.json({
      message: "Cập nhật thiết bị thành công!",
      device: updatedDevice
    });

  } catch (err) {
    console.error("Lỗi cập nhật thiết bị:", err);
    res.status(400).json({ error: err.message });
  }
});
// Xóa thiết bị
router.delete("/:id", async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thiết bị thành công" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mượn thiết bị
router.post("/borrow/:id", async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: "Không tìm thấy thiết bị" });
    if (device.status === "borrowed") return res.status(400).json({ message: "Thiết bị đang được mượn" });

    device.status = "borrowed";
    await device.save({ validateBeforeSave: false });

    const { contract } = req.app.locals;
    if (contract) {
      const tx = await contract.addLog("BORROW", device.name);
      await tx.wait();
    }

    res.json({ message: "Mượn thiết bị thành công", device });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trả thiết bị
router.post("/return/:id", async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: "Không tìm thấy thiết bị" });
    if (device.status === "available") return res.status(400).json({ message: "Thiết bị đã được trả" });

    device.status = "available";
    await device.save({ validateBeforeSave: false });

    const { contract } = req.app.locals;
    if (contract) {
      const tx = await contract.addLog("RETURN", device.name);
      await tx.wait();
    }

    res.json({ message: "Trả thiết bị thành công", device });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;