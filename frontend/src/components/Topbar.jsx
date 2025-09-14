import { SignedOut, UserButton, useAuth } from "@clerk/clerk-react"; // Thành phần quản lý trạng thái đăng nhập/đăng xuất từ Clerk
import { LayoutDashboardIcon } from "lucide-react"; // Biểu tượng giao diện dashboard
import { Link } from "react-router-dom"; // Thành phần điều hướng trong React Router
import SignInOAuthButtons from "./SignInOAuthButtons"; // Component nút đăng nhập OAuth
import { useAuthStore } from "../stores/useAuthStore"; // Store quản lý trạng thái xác thực người dùng
import { cn } from "../lib/utils"; // Hàm kết hợp className
import { buttonVariants } from "./ui/button"; // Biến kiểu dáng cho nút
import SearchInput from "./SearchInput"; // Thành phần ô tìm kiếm

// Định nghĩa component Topbar
const Topbar = () => {
  // Lấy trạng thái isAdmin từ store xác thực
  const { isAdmin, isLoading } = useAuthStore();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    // Thanh công cụ nằm trên cùng của ứng dụng
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      {/* Logo và tên ứng dụng */}
      <div className="flex gap-2 items-center">
        <img src="/img/logo.png" className="size-8" alt="Logo" />{" "}
        {/* Hiển thị logo */}
        Music App {/* Tên ứng dụng */}
      </div>

      {/* Ô tìm kiếm */}
      <div className="flex-1 max-w-xl px-4">
        <SearchInput placeholder="Tìm kiếm bài hát..." />{" "}
        {/* Component tìm kiếm bài hát */}
      </div>

      {/* Các nút chức năng */}
      <div className="flex items-center gap-4">
        {/* Nút vào trang quản trị: chỉ hiển thị khi là admin */}
        {isLoaded && !isLoading && isAdmin && (
          <Link
            to="/admin"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboardIcon className="size-4 mr-2" /> Admin Dashboard
          </Link>
        )}

        {/* Hiển thị nút đăng nhập nếu người dùng chưa đăng nhập */}
        <SignedOut>
          <SignInOAuthButtons /> {/* Component nút đăng nhập OAuth */}
        </SignedOut>

        {/* Nút hiển thị thông tin người dùng nếu đã đăng nhập */}
        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;
