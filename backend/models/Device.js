const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, default: "available" },
  location: { type: String, default: "" },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },

  // --- CÁC TRƯỜNG MỚI CHO DỰ BÁO ---
  purchaseDate: { type: Date, default: Date.now }, // Ngày mua (để tính tuổi thọ)
  
  // Tổng số lần mượn/sử dụng (lấy từ log Blockchain hoặc tăng mỗi khi mượn)
  usageCount: { type: Number, default: 0 }, 
  
  // Lịch sử các lần bảo trì trước đây (Dữ liệu này dùng để train AI)
  maintenanceHistory: [{
    date: Date,       // Ngày bảo trì
    issue: String,    // Vấn đề gặp phải
    cost: Number      // Chi phí (nếu cần)
  }],

  // Kết quả dự báo sẽ lưu vào đây để hiển thị lên Frontend
  nextMaintenanceDate: { type: Date } 
});

module.exports = mongoose.model("Device", deviceSchema);