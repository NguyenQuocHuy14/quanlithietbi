const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },          // Tên thiết bị
  category: { type: String, required: true },      // Loại thiết bị (VD: Máy chiếu, Laptop,...)
  status: { type: String, default: "available" },  // available | borrowed
  location: { type: String, default: "" },         // Vị trí thiết bị
  image: { type: String },
  createdAt: { type: Date, default: Date.now }     // Thời gian thêm
});

module.exports = mongoose.model("Device", deviceSchema);
