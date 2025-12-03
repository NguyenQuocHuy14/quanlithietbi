// src/App.jsx - HOÀN HẢO 100% SAU KHI SỬA
import React, { useState } from 'react';
import DeviceList from './pages/DeviceList';
import History from './pages/History';           // ĐÃ CÓ
import Footer from './app/components/layout/footer/Footer';
import Header from './app/components/layout/header/Header';
import './assets/css/header.css';
import './assets/css/app.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="main-container">
        <div className="content-wrapper">

          {/* TRANG CHỦ */}
          {currentPage === 'home' && (
            <div className="home-page">
              <h1 className="home-title">HỆ THỐNG QUẢN LÝ THIẾT BỊ</h1>
              <p className="home-subtitle">
                Quản lý thiết bị phòng lab – An toàn – Minh bạch – Thông minh
              </p>
              <button 
                className="home-button"
                onClick={() => setCurrentPage('devices')}
              >
                Vào Danh Sách Thiết Bị
              </button>
            </div>
          )}

          {/* TRANG THIẾT BỊ */}
          {currentPage === 'devices' && (
            <div className="devices-container">
              <DeviceList />
            </div>
          )}

          {/* TRANG LỊCH SỬ – THÊM DÒNG NÀY */}
          {currentPage === 'history' && (
            <div className="history-container" style={{minHeight: "70vh"}}>
              <History />
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}