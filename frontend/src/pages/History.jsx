// src/pages/History.jsx  ← ĐÚNG VỊ TRÍ CHO CRA!!!
import React, { useEffect, useState } from "react";
import axiosClient from "../app/api/axiosClient";  // ĐÚNG ĐƯỜNG DẪN CHO CRA

export default function History() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  axiosClient.get("/api/logs")
    .then(res => {
      // Kiểm tra: Nếu server trả về mảng rỗng nhưng lại không phải do chưa có giao dịch
      // (Bạn có thể quy ước với Backend trả về {error: true} nếu muốn chuẩn hơn)
      setLogs(res.data);
      setLoading(false);
      
      // THÊM ĐOẠN NÀY ĐỂ DEBUG:
      console.log("Dữ liệu nhận được:", res.data);
      if (res.data.length === 0) {
        // Có thể thêm toast/alert nhẹ nhàng nếu muốn
        console.warn("Danh sách trống. Có thể do chưa có giao dịch hoặc lỗi kết nối.");
      }
    })
    .catch(err => {
      console.error("Lỗi frontend:", err);
      // BÁO LỖI CHO NGƯỜI DÙNG Ở ĐÂY
      alert("⚠️ Không thể kết nối Blockchain! Vui lòng kiểm tra lại Backend.");
      setLoading(false);
    });
}, []);

  if (loading) return <div style={{padding: "50px", textAlign: "center", fontSize: "20px"}}>Đang tải lịch sử...</div>;

  return (
    <div style={{padding: "30px", maxWidth: "1200px", margin: "0 auto"}}>
      <h1 style={{color: "#1976d2", textAlign: "center"}}>LỊCH SỬ GIAO DỊCH BLOCKCHAIN</h1>
      <p style={{textAlign: "center", fontSize: "18px", margin: "20px 0"}}>
        Tổng cộng: <strong style={{color: "#d32f2f"}}>{logs.length}</strong> giao dịch bất biến
      </p>

      {logs.length === 0 ? (
        <div style={{textAlign: "center", padding: "60px", background: "#f5f5f5", borderRadius: "12px"}}>
          <p style={{fontSize: "20px", color: "#999"}}>Chưa có giao dịch nào</p>
          <p>Hãy vào trang Thiết bị → bấm "Mượn" để tạo log đầu tiên!</p>
        </div>
      ) : (
        <table style={{width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)"}}>
          <thead>
            <tr style={{background: "#1976d2", color: "white"}}>
              <th style={{padding: "16px"}}>Thời gian</th>
              <th style={{padding: "16px"}}>Hành động</th>
              <th style={{padding: "16px"}}>Thiết bị</th>
              <th style={{padding: "16px"}}>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} style={{borderBottom: "1px solid #eee"}}>
                <td style={{padding: "16px", textAlign: "center"}}>
                  {new Date(Number(log.timestamp) * 1000).toLocaleString("vi-VN")}
                </td>
                <td style={{padding: "16px", textAlign: "center"}}>
                  <span style={{
                    padding: "8px 16px",
                    borderRadius: "30px",
                    background: log.action === "BORROW" ? "#ff5722" : "#4caf50",
                    color: "white",
                    fontWeight: "bold"
                  }}>
                    {log.action === "BORROW" ? "MƯỢN" : "TRẢ"}
                  </span>
                </td>
                <td style={{padding: "16px", fontWeight: "600"}}>{log.deviceName}</td>
                <td style={{padding: "16px"}}>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${log.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color: "#1976d2", fontFamily: "monospace"}}
                  >
                    {log.txHash.slice(0, 10)}...{log.txHash.slice(-8)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}