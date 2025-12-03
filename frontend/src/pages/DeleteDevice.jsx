// src/app/pages/DeleteDevice.jsx
"use client";

export default function DeleteDevice({ isOpen, onClose, device, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
        <h3>Xóa thiết bị?</h3>
        <p>Bạn có chắc chắn muốn xóa <strong>{device?.name}</strong>?</p>
        <div style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "center" }}>
          <button onClick={onConfirm} style={{ background: "#dc3545", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px" }}>
            Xóa luôn
          </button>
          <button onClick={onClose} style={{ background: "#6c757d", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px" }}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}