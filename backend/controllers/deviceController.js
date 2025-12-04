const axios = require('axios'); // Nhớ cài: npm install axios
const Device = require('../models/Device');

exports.predictMaintenance = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const device = await Device.findById(deviceId);

    // Lấy ngày bảo trì gần nhất (hoặc ngày mua nếu chưa bảo trì)
    const lastMaint = device.maintenanceHistory.length > 0 
      ? device.maintenanceHistory[device.maintenanceHistory.length - 1].date 
      : device.purchaseDate;

    // GỌI SANG PYTHON
    const response = await axios.post('http://localhost:5000/predict', {
      usageCount: device.usageCount,
      lastMaintenanceDate: lastMaint
    });

    // Cập nhật kết quả vào DB
    device.nextMaintenanceDate = response.data.predicted_date;
    await device.save();

    res.json({ 
      message: "Dự báo thành công", 
      result: response.data 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi dự báo" });
  }
};