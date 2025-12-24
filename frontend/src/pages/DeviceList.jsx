"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "../app/api/axiosClient";
import AddDevice from "./AddDevice";
import EditDevice from "./EditDevice";
import DeleteDevice from "./DeleteDevice";
import "../assets/css/deviceList.css";

export default function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Tìm kiếm & lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadDevices = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/devices");
      setDevices(res.data);
    } catch (err) {
      alert("Không thể tải danh sách thiết bị!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  // Tự động focus thanh tìm kiếm khi nhấn "/"
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.querySelector(".search-box input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Lọc thiết bị
  const filteredDevices = devices.filter((d) => {
    const matchesSearch = d.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "ready" && d.quantity > 0) ||
      (statusFilter === "borrowed" && d.quantity === 0);
    return matchesSearch && matchesStatus;
  });
// --- CHÈN ĐOẠN NÀY VÀO TRƯỚC const handleBorrow ---
  const handlePredict = async (id) => {
    try {
      const confirmPredict = window.confirm("Hệ thống sẽ gửi dữ liệu sang AI để phân tích. Bạn có muốn tiếp tục?");
      if (!confirmPredict) return;

      const res = await axiosClient.post(`/api/predict/${id}`);
      const data = res.data;

      if (data.prediction) {
        const date = new Date(data.prediction.predicted_date).toLocaleDateString('vi-VN');
        const daysLeft = data.prediction.days_remaining;
        alert(`🤖 KẾT QUẢ DỰ BÁO:\n\n📅 Ngày bảo trì: ${date}\n⏳ Còn lại: ${daysLeft} ngày.`);
        loadDevices(); 
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Lỗi: Không thể kết nối đến AI Service!");
    }
  };
  // ---------------------------------------------------
  // Hàm mượn thiết bị (giữ nguyên logic cũ + blockchain log)
  // Thay thế toàn bộ hàm handleBorrow cũ bằng đoạn này:
  const handleBorrow = async (device) => {
    // 1. Kiểm tra nhanh ở Frontend
    if (device.quantity <= 0) {
      alert("Thiết bị này đã hết, không thể mượn!");
      return;
    }

    const confirm = window.confirm(`Bạn muốn mượn thiết bị: "${device.name}"?\nHành động này sẽ được ghi lại trên Blockchain.`);
    if (!confirm) return;

    try {
      // 2. GỌI API MƯỢN CHUYÊN DỤNG (POST /borrow)
      // API này ở Backend sẽ tự làm 3 việc: Trừ kho, Tăng usageCount, Ghi log
      const res = await axiosClient.post(`/api/devices/borrow/${device._id}`);

      if (res.data.success) {
        alert(`✅ Mượn thành công!\n(Số lần dùng đã được tăng lên để phục vụ dự báo AI)`);
        loadDevices(); // Tải lại danh sách để thấy số mới
      }
    } catch (err) {
      console.error("Lỗi mượn:", err);
      // Hiển thị lỗi từ Backend trả về (nếu có)
      const errorMsg = err.response?.data?.error || "Có lỗi xảy ra khi mượn!";
      alert("❌ Lỗi: " + errorMsg);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/api/devices/${selectedDevice._id}`);
      loadDevices();
      setDeleteOpen(false);
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  if (loading) return <div className="loading">Đang tải thiết bị...</div>;

  return (
    <div className="device-list-wrapper">
      {/* HEADER CỐ ĐỊNH */}
      <div className="header-bar">
        <h1>
          Quản lý thiết bị <span className="count-badge">{filteredDevices.length}</span>
        </h1>

        <div className="search-filter-bar">
        <div className="search-box">
  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
  <input
    type="text"
    placeholder="Tìm thiết bị... (Nhấn / để focus)"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="ready">Sẵn sàng</option>
            <option value="borrowed">Hết hàng</option>
          </select>

          <button className="btn-add-device" onClick={() => setAddOpen(true)}>
            + Thêm thiết bị
          </button>
        </div>
      </div>

      {/* BẢNG CHỈ CUỘN */}
      <div className="table-scroll-container">
        <div className="table-container">
          <table className="device-table">
            <thead>
              <tr>
                <th className="col-image">Hình ảnh</th>
                <th className="col-name">Tên thiết bị</th>
                <th className="col-desc">Mô tả</th>
                <th className="col-usage" style={{minWidth: "100px"}}>Đã dùng</th>
                <th className="col-quantity">Số lượng</th>
                <th className="col-status">Trạng thái</th>
                <th className="col-action">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    Không tìm thấy thiết bị nào
                  </td>
                </tr>
              ) : (
                filteredDevices.map((d) => (
                  <tr key={d._id}>
                    <td className="col-image">
                      <div className="image-wrapper">
                        <img
                          src={d.image ? `http://localhost:5000${d.image}` : "https://via.placeholder.com/80/f8f9fa/9ca3af?text=No+Img"}
                          alt={d.name}
                          onError={(e) => e.target.src = "https://via.placeholder.com/80/f8f9fa/9ca3af?text=No+Img"}
                        />
                      </div>
                    </td>
                    <td className="col-name"><strong>{d.name || "-"}</strong></td>
                    <td className="col-desc">{d.description || "-"}</td>
                    <td className="col-usage" style={{textAlign: "center", fontWeight: "bold", color: "#6f42c1"}}>
    {d.usageCount || 0} lần
  </td>
                    <td className="col-quantity">
                      <span className={`quantity-badge ${d.quantity === 0 ? "zero" : ""}`}>
                        {d.quantity}
                      </span>
                    </td>
                    <td className="col-status">
                      <span className={d.quantity > 0 ? "status ready" : "status borrowed"}>
                        {d.quantity > 0 ? "Sẵn sàng" : "Hết hàng"}
                      </span>
                    </td>
                    <td className="col-action">
                      {/* 👇 THÊM NÚT NÀY VÀO ĐẦU TIÊN 👇 */}
  <button 
    className="btn-edit" 
    style={{ backgroundColor: '#6f42c1', color: 'white', marginRight: '5px', borderColor: '#6f42c1' }}
    onClick={() => handlePredict(d._id)}
  >
    🔮 AI
  </button>
                      <button
                        className="btn-borrow"
                        onClick={() => handleBorrow(d)}
                        disabled={d.quantity <= 0}
                      >
                        Mượn
                      </button>
                      <button className="btn-edit" onClick={() => { setSelectedDevice(d); setEditOpen(true); }}>
                        Sửa
                      </button>
                      <button className="btn-delete" onClick={() => { setSelectedDevice(d); setDeleteOpen(true); }}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddDevice isOpen={addOpen} onClose={() => setAddOpen(false)} onSuccess={loadDevices} />
      <EditDevice isOpen={editOpen} onClose={() => setEditOpen(false)} device={selectedDevice} onSuccess={loadDevices} />
      <DeleteDevice isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} device={selectedDevice} onConfirm={handleDelete} />
    </div>
  );
}