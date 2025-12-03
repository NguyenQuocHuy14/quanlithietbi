// src/app/layout.jsx   ← file này phải tồn tại!
import './globals.css'
import Header from './components/layout/header/Header'
import Footer from './components/layout/footer/Footer'   // có thể bỏ nếu chưa có

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  )
}