// src/app/history/page.jsx   ← ĐÚNG VỊ TRÍ!!!
"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient"; // dùng @ nếu có jsconfig, hoặc "../api/axiosClient"
import "@/assets/css/history.css";

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosClient.get("/api/logs");
        setLogs(res.data);
      } catch (err) {
        console.error(err);
        alert("Lỗi tải lịch sử blockchain!");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="container">Đang tải lịch sử blockchain...</div>;

  return (
    <div className="container">
      <h1>Lịch Sử Giao Dịch Trên Blockchain</h1>
      <p><strong>Tổng cộng: {logs.length} bản ghi bất biến</strong></p>

      {logs.length === 0 ? (
        <p style={{color: "#666", fontStyle: "italic"}}>Chưa có giao dịch nào. Hãy mượn/trả thiết bị để tạo log!</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Hành động</th>
              <th>Tên thiết bị</th>
              <th>Tx Hash</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td>{new Date(Number(log.timestamp) * 1000).toLocaleString("vi-VN")}</td>
                <td>
                  <span className={`badge ${log.action === "BORROW" ? "borrow" : "return"}`}>
                    {log.action === "BORROW" ? "Mượn" : "Trả"}
                  </span>
                </td>
                <td>{log.deviceName}</td>
                <td>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${log.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
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