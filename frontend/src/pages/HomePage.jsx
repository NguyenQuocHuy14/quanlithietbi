// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../app/api/axiosClient";

export default function HomePage() {
  const [stats, setStats] = useState({ total: 0, outOfStock: 0, lowStock: 0, active: 0 });

  useEffect(() => {
    // Gọi API thống kê
    axiosClient.get("/api/dashboard-stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ color: "#2c3e50", fontSize: "2.5rem", marginBottom: "10px" }}>
          Hệ Thống Quản Lý Thiết Bị Trường Học
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "1.2rem" }}>
          Ứng dụng Blockchain & AI trong quản lý vòng đời tài sản công
        </p>
      </div>

      {/* DASHBOARD CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        
        {/* Card 1: Tổng quan */}
        <div style={cardStyle("#3498db")}>
          <h3>Tổng Thiết Bị</h3>
          <p style={numberStyle}>{stats.total}</p>
          <Link to="/devices" style={linkStyle}>Xem danh sách &rarr;</Link>
        </div>

        {/* Card 2: Hoạt động */}
        <div style={cardStyle("#2ecc71")}>
          <h3>Sẵn Sàng Cấp Phát</h3>
          <p style={numberStyle}>{stats.active}</p>
          <small>Thiết bị đang trong kho</small>
        </div>

        {/* Card 3: Cảnh báo */}
        <div style={cardStyle("#e67e22")}>
          <h3>Sắp Hết Hàng</h3>
          <p style={numberStyle}>{stats.lowStock}</p>
          <small>Số lượng dưới 5</small>
        </div>

        {/* Card 4: Hư hỏng/Hết */}
        <div style={cardStyle("#e74c3c")}>
          <h3>Đã Hết / Hỏng</h3>
          <p style={numberStyle}>{stats.outOfStock}</p>
          <Link to="/predictive" style={linkStyle}>Xem dự báo AI &rarr;</Link>
        </div>
      </div>

      {/* Khu vực giới thiệu nhanh */}
      <div style={{ marginTop: "60px", padding: "30px", background: "white", borderRadius: "10px", boxShadow: "0 2px 15px rgba(0,0,0,0.05)" }}>
        <h2 style={{ color: "#34495e" }}>🚀 Tính năng nổi bật</h2>
        <ul style={{ lineHeight: "1.8", color: "#555" }}>
          <li>✅ <strong>Minh bạch hóa:</strong> Mọi giao dịch mượn/trả đều được ghi lại trên <strong>Blockchain Sepolia</strong>.</li>
          <li>✅ <strong>Dự báo thông minh:</strong> Hệ thống tự động phân tích rủi ro bảo trì.</li>
          <li>✅ <strong>Quản lý tập trung:</strong> Theo dõi nhập xuất tồn kho theo thời gian thực.</li>
        </ul>
      </div>
    </div>
  );
}

// CSS Styles (Viết trực tiếp cho gọn)
const cardStyle = (color) => ({
  background: color,
  color: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "180px"
});

const numberStyle = {
  fontSize: "3rem",
  fontWeight: "bold",
  margin: "10px 0"
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  marginTop: "auto",
  background: "rgba(0,0,0,0.2)",
  padding: "5px 10px",
  borderRadius: "5px",
  textAlign: "center"
};