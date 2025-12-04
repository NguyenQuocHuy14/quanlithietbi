"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "../app/api/axiosClient"; //
import "../assets/css/deviceList.css"; // Tận dụng CSS cũ cho nhanh

export default function Prediction() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Tải danh sách thiết bị khi vào trang
  useEffect(() => {
    async function fetchDevices() {
      try {
        const res = await axiosClient.get("/api/devices");
        setDevices(res.data);
      } catch (err) {
        console.error("Lỗi tải thiết bị:", err);
      }
    }
    fetchDevices();
  }, []);

  // Hàm gọi AI dự báo
  const handlePredict = async (device) => {
    setSelectedDevice(device);
    setLoading(true);
    setPrediction(null); // Reset kết quả cũ

    try {
      const res = await axiosClient.post(`/api/predict/${device._id}`);
      if (res.data.prediction) {
        setPrediction(res.data.prediction);
      }
    } catch (err) {
      alert("Không thể kết nối Server AI (Python)!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="device-list-wrapper" style={{ padding: "20px", display: "flex", gap: "20px" }}>
      
      {/* CỘT TRÁI: DANH SÁCH THIẾT BỊ */}
      <div style={{ flex: 1, background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "20px", color: "#333" }}>📋 Chọn thiết bị</h2>
        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          <table className="device-table">
            <thead>
              <tr>
                <th>Tên thiết bị</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d._id} style={{ cursor: "pointer", background: selectedDevice?._id === d._id ? "#f0f0f0" : "white" }}>
                  <td>
                    <strong>{d.name}</strong> <br/>
                    <small style={{color: "#666"}}>Số lần dùng: {d.usageCount || 0}</small>
                  </td>
                  <td>
                    <button 
                      className="btn-edit"
                      style={{ backgroundColor: "#6f42c1", color: "white", border: "none" }}
                      onClick={() => handlePredict(d)}
                    >
                      🔮 Phân tích
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CỘT PHẢI: KẾT QUẢ DỰ BÁO */}
      <div style={{ flex: 1, background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "20px", color: "#333" }}>📊 Kết quả phân tích AI</h2>
        
        {loading && <div style={{ textAlign: "center", padding: "50px" }}>🔄 Đang xử lý dữ liệu...</div>}

        {!loading && !prediction && !selectedDevice && (
            <div style={{ textAlign: "center", color: "#999", padding: "50px" }}>
                👈 Vui lòng chọn một thiết bị để xem dự báo
            </div>
        )}

        {!loading && prediction && selectedDevice && (
          <div className="prediction-result">
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <img 
                    src={selectedDevice.image ? `http://localhost:5000${selectedDevice.image}` : "https://via.placeholder.com/150"} 
                    alt="Device" 
                    style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px", marginBottom: "15px" }}
                />
                <h3 style={{ color: "#007bff" }}>{selectedDevice.name}</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={cardStyle}>
                    <h4>📅 Ngày bảo trì dự kiến</h4>
                    <p style={valueStyle}>{new Date(prediction.predicted_date).toLocaleDateString('vi-VN')}</p>
                </div>
                <div style={cardStyle}>
                    <h4>⏳ Thời gian còn lại</h4>
                    <p style={{...valueStyle, color: prediction.days_remaining < 30 ? "red" : "green"}}>
                        {prediction.days_remaining} ngày
                    </p>
                </div>
                <div style={{...cardStyle, gridColumn: "span 2"}}>
                    <h4>💡 Khuyến nghị của AI</h4>
                    <p style={{ fontSize: "16px", marginTop: "5px" }}>
                        {prediction.days_remaining < 30 
                            ? "⚠️ CẢNH BÁO: Thiết bị sắp đến hạn bảo trì. Cần lên kế hoạch kiểm tra ngay!" 
                            : "✅ Tình trạng ổn định. Chưa cần can thiệp kỹ thuật."}
                    </p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Style nội bộ cho gọn
const cardStyle = {
    background: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #e9ecef"
};

const valueStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#333"
};