"use client";
// src/app/components/layout/header/Header.jsx
import React from "react";
import "../../../../assets/css/header.css";

function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="header">
      <div className="header-left">
        <span>Quản lý thiết bị</span>
      </div>

      <nav className="header-right">
        {/* 4 NÚT GIỐNG NHAU 100% */}
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); setCurrentPage("home"); }}
          className={currentPage === "home" ? "active" : ""}
        >
          Trang chủ
        </a>

        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); setCurrentPage("devices"); }}
          className={currentPage === "devices" ? "active" : ""}
        >
          Thiết bị
        </a>

       <a 
  href="#"
  onClick={(e) => { e.preventDefault(); setCurrentPage('history'); }}
  className={currentPage === 'history' ? "active" : ""}
>
  Lịch sử
</a>
        <a href="/account">Tài khoản</a>
      </nav>
    </header>
  );
}

export default Header;