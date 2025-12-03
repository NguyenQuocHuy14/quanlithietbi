// src/app/components/layout/header/Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";  // THÊM DÒNG NÀY
import "../../../../assets/css/header.css";

function Header() {
  const location = useLocation(); // Lấy đường dẫn hiện tại để đánh dấu active

  // Hàm giúp tự động thêm class "active" khi đúng trang
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-text">
          Quản lý thiết bị
        </Link>
      </div>

      <nav className="header-right">
        <Link 
          to="/" 
          className={isActive("/")}
        >
          Trang chủ
        </Link>

        <Link 
          to="/devices" 
          className={isActive("/devices")}
        >
          Thiết bị
        </Link>

        <Link 
          to="/history" 
          className={isActive("/history")}
        >
          Lịch sử
        </Link>

        <Link 
          to="/account" 
          className={isActive("/account")}
        >
          Tài khoản
        </Link>
      </nav>
    </header>
  );
}

export default Header;