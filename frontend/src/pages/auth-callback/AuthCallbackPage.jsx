import { Card, CardContent } from "@/components/ui/card"; // Nhập các thành phần Card từ thư viện UI
import { axiosInstance } from "@/lib/axios"; // Nhập axiosInstance để thực hiện các yêu cầu HTTP
import { useUser } from "@clerk/clerk-react"; // Nhập hook useUser từ Clerk để lấy thông tin người dùng
import { Loader } from "lucide-react"; // Nhập biểu tượng Loader từ Lucide (dùng để hiển thị hiệu ứng loading)
import { useEffect, useRef } from "react"; // Nhập hook useEffect và useRef từ React
import { useNavigate } from "react-router-dom"; // Nhập hook useNavigate từ React Router để điều hướng giữa các trang

const AuthCallbackPage = () => {
    // Lấy trạng thái của người dùng (isLoaded, user) từ Clerk
    const { isLoaded, user } = useUser();

    // Tạo instance của useNavigate để điều hướng sau khi xử lý xong
    const navigate = useNavigate();

    // useRef để tránh thực hiện yêu cầu đồng bộ nhiều lần
    const syncAttempted = useRef(false);

    useEffect(() => {
        // Hàm xử lý đồng bộ người dùng với backend
        const syncUser = async () => {
            // Kiểm tra nếu chưa tải người dùng hoặc không có người dùng, hoặc đã thực hiện đồng bộ
            if (!isLoaded || !user || syncAttempted.current) return;

            try {
                // Đánh dấu là đã thực hiện đồng bộ
                syncAttempted.current = true;

                // Gửi thông tin người dùng lên server (kèm id, tên, ảnh)
                await axiosInstance.post("/auth/callback", {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl,
                });
            } catch (error) {
                // Nếu có lỗi trong quá trình gửi thông tin
                console.log("Error in auth callback", error);
            } finally {
                // Sau khi gửi thông tin, điều hướng người dùng về trang chủ
                navigate("/");
            }
        };

        // Gọi hàm đồng bộ người dùng
        syncUser();
    }, [isLoaded, user, navigate]);

    return (
        <div className='h-screen w-full bg-black flex items-center justify-center'>
            {/* Hiển thị giao diện loading */}
            <Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
                <CardContent className='flex flex-col items-center gap-4 pt-6'>
                    {/* Hiển thị icon loading */}
                    <Loader className='size-6 text-emerald-500 animate-spin' />
                    <h3 className='text-zinc-400 text-xl font-bold'>Logging you in</h3>
                    <p className='text-zinc-400 text-sm'>Redirecting...</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthCallbackPage;
