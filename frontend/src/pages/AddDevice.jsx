// src/app/pages/AddDevice.jsx
"use client";

import React, { useState } from "react";
import axiosClient from "../app/api/axiosClient";
import "../assets/css/addDevice.css";

export default function AddDevice({ isOpen, onClose, onSuccess }) {
  // THÊM TRƯỜNG QUANTITY VÀO ĐÂY
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",        // mới thêm
    description: "",     // đổi từ category → description cho đúng backend
    image: null,
  });
  const [preview, setPreview] = useState(null);

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

  if (!formData.quantity || formData.quantity < 0) {
    alert("Vui lòng nhập số lượng hợp lệ (≥ 0)");
    return;
  }

  const data = new FormData();
  data.append("name", formData.name.trim());
  data.append("quantity", formData.quantity);
  data.append("description", formData.description);
  if (formData.image) data.append("image", formData.image);

  try {
    // ← ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT – THÊM HEADER multipart/form-data
    await axiosClient.post("/api/devices", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const toast = document.createElement("div");
    toast.innerText = "Thêm thiết bị thành công!";
    toast.style.cssText = 
      "position:fixed;top:20px;right:20px;background:#4caf50;color:white;padding:16px 24px;border-radius:8px;z-index:10000;box-shadow:0 4px 20px rgba(0,0,0,0.2);font-weight:600;";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);

    onSuccess();
    onClose();
  } catch (err) {
    console.error("Lỗi upload:", err.response?.data || err.message);
    alert("Lỗi: " + (err.response?.data?.error || "Không thể thêm thiết bị"));
  }
};

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Thêm thiết bị mới</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>Số lượng <span className="text-red-500">*</span></label>
            <input
              type="number"           // QUAN TRỌNG NHẤT: chỉ cho nhập số
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              step="1"
              placeholder="0"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="form-group">
            <label>Mô tả (không bắt buộc)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Ghi chú về tình trạng, cấu hình..."
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh</label>
            {preview && <img src={preview} alt="Preview" className="preview-img" />}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">Thêm thiết bị</button>
            <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}