import { UserButton } from "@clerk/clerk-react"; // Nhập UserButton từ thư viện Clerk để hiển thị thông tin người dùng đã đăng nhập
import { Link } from "react-router-dom"; // Nhập Link từ react-router-dom để điều hướng giữa các trang

const Header = () => {
    return (
        <div className='flex items-center justify-between'> {/* Cấu trúc Flexbox cho layout, căn giữa các phần tử và phân bố đều */}
            <div className='flex items-center gap-3 mb-8'> {/* Flexbox để căn giữa logo và tiêu đề */}
                <Link to='/' className='rounded-lg'> {/* Link tới trang chủ khi nhấp vào logo */}
                    <img src='/img/logo.png' className='size-10 text-black' /> {/* Logo của ứng dụng */}
                </Link>
                <div>
                    <h1 className='text-3xl font-bold'>Music Manager</h1> {/* Tiêu đề của trang */}
                    <p className='text-zinc-400 mt-1'>Manage your music catalog</p> {/* Mô tả ngắn gọn */}
                </div>
            </div>
            <UserButton /> {/* Hiển thị nút người dùng (đăng nhập/đăng xuất) */}
        </div>
    );
};

export default Header;
