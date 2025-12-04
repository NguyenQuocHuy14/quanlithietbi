import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import các trang
import HomePage from './pages/HomePage';
import DeviceList from './pages/DeviceList';
import History from './pages/History';
import Prediction from "./pages/Prediction";
import Auth from './pages/Auth'; // <--- Import trang Auth vừa tạo
import Footer from './app/components/layout/footer/Footer';
import Header from './app/components/layout/header/Header';


import './assets/css/header.css';
import './assets/css/app.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Chạy 1 lần khi web vừa mở lên
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // Đã đăng nhập
    }
  }, []);

  // --- NẾU CHƯA ĐĂNG NHẬP -> CHỈ HIỆN TRANG LOGIN ---
  if (!isAuthenticated) {
    return <Auth />;
  }

  // --- NẾU ĐÃ ĐĂNG NHẬP -> HIỆN GIAO DIỆN CHÍNH ---
  return (
    <>
      <Header />
      
      <main className="main-container">
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/devices" element={<div className="devices-container"><DeviceList /></div>} />
            <Route path="/history" element={<div className="history-container"><History /></div>} />
            <Route path="/account" element={<div>Trang tài khoản</div>} />
            {/* Nếu gõ lung tung thì về trang chủ */}
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/prediction" element={<Prediction />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </>
  );
}