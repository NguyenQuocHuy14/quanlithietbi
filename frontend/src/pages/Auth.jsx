import React, { useState } from "react";
import axiosClient from "../app/api/axiosClient";
import "../assets/css/auth.css"; // CSS làm đẹp

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true); // true: Đăng nhập, false: Đăng ký
  const [formData, setFormData] = useState({ username: "", password: "", fullName: "" });

  // Xử lý khi nhập liệu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý khi bấm nút Gửi
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await axiosClient.post(endpoint, formData);

      if (isLogin) {
        // Đăng nhập thành công -> Lưu thông tin vào máy
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", res.data.role);
        
        alert("Đăng nhập thành công!");
        window.location.reload(); // Tải lại trang để vào App chính
      } else {
        // Đăng ký thành công -> Chuyển qua form đăng nhập
        alert("Đăng ký thành công! Hãy đăng nhập.");
        setIsLogin(true);
        setFormData({ username: "", password: "", fullName: "" });
      }
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Có lỗi xảy ra"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}</h2>
        <form onSubmit={handleSubmit}>
          
          {/* Form Đăng Ký thì hiện thêm Họ Tên */}
          {!isLogin && (
            <div className="input-group">
              <label>Họ và tên</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
          )}

          <div className="input-group">
            <label>Tài khoản</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-submit">
            {isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </button>
        </form>

        <p className="switch-text">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Đăng ký ngay" : " Đăng nhập ngay"}
          </span>
        </p>
      </div>
    </div>
  );
}