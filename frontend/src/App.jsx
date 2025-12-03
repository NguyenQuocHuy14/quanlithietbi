// src/App.jsx - PHIÊN BẢN CHUẨN REACT ROUTER (HOÀN HẢO 1000%)
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import DeviceList from './pages/DeviceList';
import History from './pages/History';

import Footer from './app/components/layout/footer/Footer';
import Header from './app/components/layout/header/Header';

import './assets/css/header.css';
import './assets/css/app.css';

export default function App() {
  return (
    <>
      <Header />

      <main className="main-container">
        <div className="content-wrapper">
          <Routes>
            {/* TRANG CHỦ - MỞ WEB LÀ THẤY NGAY */}
            <Route path="/" element={<HomePage />} />

            {/* DANH SÁCH THIẾT BỊ */}
            <Route path="/devices" element={
              <div className="devices-container">
                <DeviceList />
              </div>
            } />

            {/* LỊCH SỬ */}
            <Route path="/history" element={
              <div className="history-container" style={{ minHeight: '70vh' }}>
                <History />
              </div>
            } />

            {/* Trang dự báo AI (nếu có sau này) */}
            <Route path="/predictive" element={<div>Trang Dự Báo AI (sắp ra mắt)</div>} />
          </Routes>
        </div>
      </main>

      <Footer />
    </>
  );
}