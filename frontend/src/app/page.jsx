// src/app/page.jsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "48px", color: "#1976d2", marginBottom: "20px" }}>
        HỆ THỐNG QUẢN LÝ THIẾT BỊ
      </h1>
      <p style={{ fontSize: "24px", color: "#555", marginBottom: "40px" }}>
        Ứng dụng Blockchain – Minh bạch – An toàn – Thông minh
      </p>
      <Link href="/devices">
        <button style={{
          padding: "16px 40px",
          fontSize: "20px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(25,118,210,0.4)"
        }}>
          Vào Danh Sách Thiết Bị
        </button>
      </Link>
    </div>
  );
}