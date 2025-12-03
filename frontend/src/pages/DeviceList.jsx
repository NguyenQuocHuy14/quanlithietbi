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

  // --- HÀM XỬ LÝ MƯỢN (MỚI) ---
  const handleBorrow = async (device) => {
    // 1. Kiểm tra số lượng
    if (device.quantity <= 0) {
      alert("Thiết bị này đã hết, không thể mượn!");
      return;
    }

    // 2. Xác nhận
    const confirm = window.confirm(`Bạn muốn mượn thiết bị: "${device.name}"?\nHành động này sẽ được ghi lại trên Blockchain.`);
    if (!confirm) return;

    try {
      // 3. Ghi Blockchain (QUAN TRỌNG)
      // Gọi API /api/logs để lưu bằng chứng
      await axiosClient.post("/api/logs", {
        action: "BORROW",
        deviceName: device.name
      });

      // 4. Cập nhật Database (Trừ số lượng đi 1)
      // Lưu ý: Gửi data dạng Form để tương thích với Backend Multer
      const formData = new FormData();
      formData.append("name", device.name);
      formData.append("quantity", device.quantity - 1); // Trừ 1 cái
      formData.append("description", device.description || "");
      // Không gửi ảnh mới thì backend giữ ảnh cũ

      await axiosClient.put(`/api/devices/${device._id}`, formData);

      alert(`✅ Mượn thành công! Đã ghi log Blockchain: BORROW - ${device.name}`);
      
      // 5. Tải lại danh sách
      loadDevices();

    } catch (err) {
      console.error("Lỗi mượn:", err);
      alert("❌ Có lỗi xảy ra khi mượn (Check Console)!");
    }
  };
  // -----------------------------

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
      <div className="header-bar">
        <h1>Danh sách thiết bị ({devices.length})</h1>
        <button className="btn-add-device" onClick={() => setAddOpen(true)}>
          + Thêm thiết bị
        </button>
      </div>

      <div className="table-container">
        <table className="device-table">
          <thead>
            <tr>
              <th className="col-image">Hình ảnh</th>
              <th className="col-name">Tên thiết bị</th>
              <th className="col-desc">Mô tả</th>
              <th className="col-quantity">Số lượng</th>
              <th className="col-status">Trạng thái</th>
              <th className="col-action" style={{minWidth: "220px"}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d._id}>
                {/* ẢNH */}
                <td className="col-image">
                  <div className="image-wrapper">
                    <img
                      src={d.image ? `http://localhost:5000${d.image}` : "https://via.placeholder.com/80/f8f9fa/9ca3af?text=No+Img"}
                      alt={d.name}
                      onError={(e) => e.target.src = "https://via.placeholder.com/80/f8f9fa/9ca3af?text=No+Img"}
                    />
                  </div>
                </td>

                <td className="col-name">
                  <strong>{d.name || "-"}</strong>
                </td>
                <td className="col-desc">{d.description || "-"}</td>
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
                  {/* NÚT MƯỢN (MỚI) */}
                  <button 
                    className="btn-borrow" 
                    onClick={() => handleBorrow(d)}
                    disabled={d.quantity <= 0} // Hết hàng thì khóa nút
                    style={{
                        marginRight: "8px",
                        backgroundColor: d.quantity > 0 ? "#28a745" : "#ccc",
                        cursor: d.quantity > 0 ? "pointer" : "not-allowed"
                    }}
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
            ))}
          </tbody>
        </table>
      </div>

      <AddDevice isOpen={addOpen} onClose={() => setAddOpen(false)} onSuccess={loadDevices} />
      <EditDevice isOpen={editOpen} onClose={() => setEditOpen(false)} device={selectedDevice} onSuccess={loadDevices} />
      <DeleteDevice isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} device={selectedDevice} onConfirm={handleDelete} />
    </div>
  );
}