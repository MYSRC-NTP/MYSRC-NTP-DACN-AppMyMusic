import { StrictMode } from "react"; // Kích hoạt Strict Mode để phát hiện các vấn đề tiềm ẩn trong ứng dụng
import { createRoot } from "react-dom/client"; // Phương thức mới để khởi tạo ứng dụng React
import "./index.css"; // Tệp CSS cho ứng dụng
import App from "./App"; // Thành phần chính của ứng dụng
import { ClerkProvider } from "@clerk/clerk-react"; // Cung cấp dịch vụ xác thực Clerk
import { BrowserRouter } from "react-router-dom"; // Dùng cho định tuyến của ứng dụng
import AuthProvider from "./providers/AuthProvider"; // Cung cấp ngữ cảnh xác thực tùy chỉnh của bạn

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY; // Lấy khóa công khai từ môi trường

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key"); // Kiểm tra nếu thiếu khóa công khai, gây lỗi
}

// Khởi tạo ứng dụng React và gắn vào phần tử có id 'root'
createRoot(document.getElementById("root")).render(
    <StrictMode> {/* StrictMode giúp phát hiện các vấn đề trong ứng dụng React */}
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'> {/* Cung cấp dịch vụ xác thực Clerk */}
            <AuthProvider> {/* Cung cấp AuthContext cho ứng dụng */}
                <BrowserRouter> {/* Điều hướng với React Router */}
                    <App /> {/* Thành phần chính của ứng dụng */}
                </BrowserRouter>
            </AuthProvider>
        </ClerkProvider>
    </StrictMode>
);
