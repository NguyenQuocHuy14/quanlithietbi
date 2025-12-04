// src/app/components/layout/header/Header.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../../assets/css/header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? "active" : "";

  // Kiểm tra đăng nhập
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("token");
      // Xóa thêm các item khác nếu có
      localStorage.removeItem("username"); 
      localStorage.removeItem("role");

      // Điều hướng về trang login hoặc trang chủ
      navigate("/"); 
      window.location.reload(); // Reload để cập nhật lại trạng thái header
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-text">
          Quản lý thiết bị
        </Link>
      </div>

      <nav className="header-right">
        <Link to="/" className={isActive("/")}>Trang chủ</Link>
        <Link to="/devices" className={isActive("/devices")}>Thiết bị</Link>
        <Link to="/history" className={isActive("/history")}>Lịch sử</Link>
        
        {/* Chỉ hiện Tài khoản khi đã đăng nhập */}
        {isLoggedIn && (
             <Link to="/account" className={isActive("/account")}>Tài khoản</Link>
        )}

        {isLoggedIn ? (
          // Dùng thẻ a với onClick cho Đăng xuất để dễ style giống Link
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a 
            href="#" 
            onClick={handleLogout} 
            className="logout-link"
            style={{ marginLeft: '15px', color: '#ff4d4f', fontWeight: 'bold' }}
          >
            Đăng xuất
          </a>
        ) : (
          // Nếu chưa đăng nhập thì hiện nút Đăng nhập (tùy chọn)
           <Link to="/login" className={isActive("/login")}>Đăng nhập</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;