import axios from "axios"; // Import axios để thực hiện các yêu cầu HTTP

// Tạo một instance axios tùy chỉnh để sử dụng trong ứng dụng
export const axiosInstance = axios.create({
    // Cấu hình baseURL dựa vào môi trường (development hoặc production)
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:4000/api" : "/api",
    // Gửi kèm cookies (Clerk session) để backend xác thực qua middleware
    withCredentials: true,
});
