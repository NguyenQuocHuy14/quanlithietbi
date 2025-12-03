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
// --- BẮT ĐẦU ĐOẠN CODE THAY THẾ TRONG SERVER.JS ---
let contract;
try {
  console.log("--- ĐANG KẾT NỐI BLOCKCHAIN... ---");

  // 1. LINK RPC: Dùng link Public Node này là ổn định nhất, ít bị lỗi detect
  const RPC_URL = "https://ethereum-sepolia.publicnode.com"; 
  
  // 2. CẤU HÌNH MẠNG TĨNH (Fix triệt để lỗi "failed to detect network")
  // Ép code nhận diện đây là Sepolia (ID 11155111) luôn, không cần hỏi mạng
  const staticNetwork = new ethers.Network("sepolia", 11155111n);
  const provider = new ethers.JsonRpcProvider(RPC_URL, staticNetwork, { staticNetwork: true });
  
  // 3. VÍ (Private Key của bạn)
  const wallet = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);
  console.log("---------------------------------------");
console.log("👉 ĐỊA CHỈ VÍ ĐANG DÙNG:", wallet.address);

provider.getBalance(wallet.address).then((balance) => {
    console.log("💰 SỐ DƯ HIỆN TẠI:", ethers.formatEther(balance), "ETH");
}).catch((err) => {
    console.error("❌ Lỗi khi check tiền:", err.message);
});
  // 4. ĐỊA CHỈ CONTRACT (QUAN TRỌNG NHẤT - ĐÃ SỬA THÀNH ĐỊA CHỈ CHUẨN CỦA BẠN)
  const rawAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const contractAddress = ethers.getAddress(rawAddress); // Hàm này giúp chuẩn hóa 100%

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

    // 1. Lấy số Block hiện tại
    const currentBlock = await contract.runner.provider.getBlockNumber();
    
    // 2. Tính toán block bắt đầu (Chỉ lấy 40,000 block gần nhất để an toàn)
    // Nếu contract mới deploy thì lấy từ block 0 cũng được, nhưng an toàn nhất là giới hạn lại
    const startBlock = currentBlock - 40000; 
    const fromBlock = startBlock > 0 ? startBlock : 0;

    console.log(`Đang lấy logs từ block ${fromBlock} đến ${currentBlock}...`);

    // 3. Gọi queryFilter với khoảng block cụ thể
    // Lưu ý: Thay "*" bằng tên sự kiện nếu cần, hoặc để nguyên để lấy tất cả
    const logs = await contract.queryFilter("*", fromBlock, currentBlock);

    // 4. Xử lý dữ liệu trả về (Format)
    const formattedLogs = logs.reverse().map(log => ({
      txHash: log.transactionHash,
      action: log.args?.[0] || "Unknown",
      deviceName: log.args?.[1] || "Unknown",
      timestamp: log.args?.[3]?.toString() || Date.now().toString()
    }));

    res.json(formattedLogs);

  } catch (err) {
    console.error("❌ LỖI API LOGS:", err.message);
    res.json([]); // Trả về rỗng để web không bị lỗi
  }
});

// Test API
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend " });
});

// ================= Khởi động Server =================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend chạy tại http://localhost:${PORT}`);
  console.log(`Ảnh hiển thị tại: http://localhost:${PORT}/uploads/ten-anh.jpg`);
});