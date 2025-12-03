// src/app/pages/EditDevice.jsx
"use client";

import React, { useState, useEffect } from "react";
import axiosClient from "../app/api/axiosClient";
import "../assets/css/editDevice.css";  // DÙNG FILE NÀY RIÊNG CHO SỬA // Dùng chung CSS với AddDevice cho đẹp

export default function EditDevice({ isOpen, onClose, device, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Khi mở modal → điền dữ liệu cũ vào form
  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name || "",
        quantity: device.quantity || 0,
        description: device.description || "",
        image: null,
      });
      setPreview(device.image ? `http://localhost:5000${device.image}` : "");
    }
  }, [device]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên thiết bị!");
      return;
    }
    if (formData.quantity < 0) {
      alert("Số lượng không được âm!");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("quantity", formData.quantity);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      await axiosClient.put(`/api/devices/${device._id}`, data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
      
      // Toast thành công đẹp như AddDevice
      const toast = document.createElement("div");
      toast.innerText = "Cập nhật thiết bị thành công!";
      toast.style.cssText = `
        position:fixed;top:20px;right:20px;background:#10b981;color:white;
        padding:16px 28px;border-radius:12px;z-index:10000;
        box-shadow:0 8px 25px rgba(0,0,0,0.2);font-weight:600;font-size:1.1rem;
        animation:slideIn 0.4s ease;
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      onSuccess();  // Reload danh sách
      onClose();
    } catch (err) {
      console.error(err);
      alert("Lỗi: " + (err.response?.data?.error || "Không thể cập nhật thiết bị"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Sửa thiết bị</h2>

        <form onSubmit={handleSubmit}>
          {/* TÊN THIẾT BỊ */}
          <div className="form-group">
            <label>Tên thiết bị <span className="text-red-500">*</span></label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Laptop Dell XPS 13"
            />
          </div>

          {/* SỐ LƯỢNG */}
          <div className="form-group">
            <label>Số lượng <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              step="1"
              placeholder="0"
            />
          </div>

          {/* MÔ TẢ */}
          <div className="form-group">
            <label>Mô tả (không bắt buộc)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Ghi chú tình trạng, cấu hình..."
            />
          </div>

          {/* ẢNH */}
          <div className="form-group">
            <label>Hình ảnh mới (không chọn = giữ nguyên)</label>
          {/* ẢNH HIỆN TẠI – NHỎ ĐẸP NHƯ TRONG BẢNG */}
{preview && (
  <div className="fixed-preview-container">
    <img
      src={preview}
      alt="Ảnh hiện tại"
      className="super-small-image"
    />
    <p className="text-sm font-medium text-blue-700">
      Ảnh hiện tại (không chọn = giữ nguyên)
    </p>
  </div>
)}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="file-input"
            />
          </div>

          {/* NÚT */}
          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Đang lưu..." : "Cập nhật"}
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}