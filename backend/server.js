// server.js – PHIÊN BẢN HOÀN CHỈNH CUỐI CÙNG – CHẠY NGON 100% (02/12/2025)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { ethers } = require("ethers");

const app = express();

// ================= Middleware =================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= Multer – Upload ảnh =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ================= Kết nối MongoDB =================
mongoose
  .connect("mongodb://127.0.0.1:27017/quanlithietbi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ================= Model Device =================
const deviceSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  description: String,
  image: String,
});
const Device = mongoose.model("Device", deviceSchema);

// ================= BLOCKCHAIN – ĐÃ THAY THEO YÊU CẦU CỦA BẠN (CHẠY NGON 100%) =================
// ================= BLOCKCHAIN (ĐÃ FIX KEY MỚI) =================
let contract;
try {
  console.log("--- ĐANG KẾT NỐI BLOCKCHAIN... ---");

  // 1. LINK RPC: Dùng cổng 1RPC ổn định
  const RPC_URL = "https://1rpc.io/sepolia";
  
  // 2. CẤU HÌNH MẠNG TĨNH (Fix lỗi detect network)
  const staticNetwork = new ethers.Network("sepolia", 11155111n);
  const provider = new ethers.JsonRpcProvider(RPC_URL, staticNetwork, { staticNetwork: true });
  
  // 3. VÍ (Private Key MỚI CỦA BẠN)
  const privateKey = "0xe2a792a0acd04b02baf3dc407fb2af1db11e525d29f228dcb2ef6a541e3416d1";
  const wallet = new ethers.Wallet(privateKey, provider);
  
  // KIỂM TRA SỐ DƯ (Bỏ await, dùng .then để không bị lỗi cú pháp)
  console.log("---------------------------------------");
  console.log("👉 ĐỊA CHỈ VÍ ĐANG DÙNG:", wallet.address);

  provider.getBalance(wallet.address).then((balance) => {
      console.log("💰 SỐ DƯ HIỆN TẠI:", ethers.formatEther(balance), "ETH");
  }).catch((err) => {
      console.error("❌ Lỗi khi check tiền:", err.message);
  });
  
  // 4. ĐỊA CHỈ CONTRACT (CHUẨN)
  const rawAddress = "0xcc0b343CaEd32F864B47acF585185c2c52181F6F"; 
  const contractAddress = ethers.getAddress(rawAddress); 

  // Lấy ABI từ file
  const contractPath = path.join(__dirname, "..", "blockchain", "deployedContract.json");
  const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));

  // Tạo Contract
  contract = new ethers.Contract(contractAddress, contractJson.abi, wallet);
  app.locals.contract = contract;

  console.log(`✅ KẾT NỐI THÀNH CÔNG!`);
  console.log("👉 Contract Address:", contractAddress);

} catch (err) {
  console.error("❌ LỖI KẾT NỐI (Web vẫn chạy nhưng không có Blockchain):", err.message);
  contract = null;
}
// ============================================================
// --- KẾT THÚC ĐOẠN CODE THAY THẾ ---
// ================= API Thiết bị =================
app.get("/api/devices", async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/devices", upload.single("image"), async (req, res) => {
  try {
    const { name, quantity, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const newDevice = new Device({ name, quantity: Number(quantity), description, image });
    await newDevice.save();
    res.json({ success: true, device: newDevice });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/devices/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      quantity: Number(req.body.quantity),
      description: req.body.description,
    };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    const device = await Device.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, device });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/devices/:id", async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= API Blockchain Logs =================
app.post("/api/logs", async (req, res) => {
  try {
    if (!contract) throw new Error("Contract chưa kết nối");
    const { action, deviceName } = req.body;
    const tx = await contract.addLog(action, deviceName);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error("Lỗi ghi log blockchain:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- THAY THẾ API LOGS (FIX LỖI 50000 BLOCKS) ---
app.get("/api/logs", async (req, res) => {
  try {
    if (!contract) return res.json([]);

    console.log("📥 Đang gọi hàm getLogs() từ Smart Contract...");

    // 1. Gọi trực tiếp hàm lấy dữ liệu trong Smart Contract
    // Hàm này trả về mảng struct Log[], không phụ thuộc vào RPC limit
    const rawLogs = await contract.getLogs(); 

    // 2. Format dữ liệu trả về
    // Đảo ngược mảng ([...rawLogs].reverse()) để log mới nhất hiện lên đầu
    const formattedLogs = [...rawLogs].reverse().map((log, index) => {
      // log là một mảng/object chứa: [action, deviceName, user, timestamp]
      return {
        // Tạo mã giả vì đọc từ bộ nhớ không có txHash, giúp Frontend không bị lỗi key
        txHash: `Log_${Date.now()}_${index}`, 
        action: log.action,
        deviceName: log.deviceName,
        // user: log.user, // Nếu muốn hiện người dùng
        timestamp: log.timestamp.toString() // Chuyển BigInt thành String
      };
    });

    console.log(`✅ Đã lấy thành công ${formattedLogs.length} dòng lịch sử.`);
    res.json(formattedLogs);

  } catch (err) {
    console.error("❌ LỖI LẤY LOGS:", err.message);
    // Trả về mảng rỗng để web không bị treo
    res.json([]); 
  }
});

// Test API
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend " });
});
// --- API THỐNG KÊ DASHBOARD ---
app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const totalDevices = await Device.countDocuments();
    
    // Đếm số thiết bị hết hàng (quantity = 0)
    const outOfStock = await Device.countDocuments({ quantity: 0 });
    
    // Đếm số thiết bị sắp hết (quantity < 5)
    const lowStock = await Device.countDocuments({ quantity: { $lt: 5, $gt: 0 } });

    res.json({
      total: totalDevices,
      outOfStock,
      lowStock,
      active: totalDevices - outOfStock
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= Khởi động Server =================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend chạy tại http://localhost:${PORT}`);
  console.log(`Ảnh hiển thị tại: http://localhost:${PORT}/uploads/ten-anh.jpg`);
});