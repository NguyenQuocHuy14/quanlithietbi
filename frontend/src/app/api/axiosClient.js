import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000", // ✅ Backend đang chạy
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient; 
