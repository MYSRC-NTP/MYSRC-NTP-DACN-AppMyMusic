// Import các thành phần cần thiết
import { useSignIn } from "@clerk/clerk-react"; // Hook để sử dụng chức năng đăng nhập của Clerk
import { Button } from "@/components/ui/button"; // Thành phần giao diện Button tùy chỉnh

// Định nghĩa component SignInOAuthButtons
const SignInOAuthButtons = () => {
    // Sử dụng hook useSignIn để lấy các phương thức và trạng thái
    const { signIn, isLoaded } = useSignIn();

    // Nếu trạng thái chưa tải xong (Clerk chưa sẵn sàng), không hiển thị gì
    if (!isLoaded) {
        return null;
    }

    // Hàm xử lý đăng nhập với Google OAuth
    const signInWithGoogle = async () => {
        try {
            // Thực hiện yêu cầu đăng nhập thông qua Google OAuth
            const result = await signIn.authenticateWithRedirect({
                strategy: "oauth_google", // Chiến lược OAuth sử dụng Google
                redirectUrl: `${window.location.origin}/sso-callback`, // URL chuyển hướng khi hoàn tất SSO
                redirectUrlComplete: `${window.location.origin}/auth-callback`, // URL cuối cùng sau khi đăng nhập thành công
                // Tùy chọn buộc Google hiển thị màn hình chọn tài khoản
                additionalData: {
                    prompt: "select_account"
                }
            });
        } catch (err) {
            // Xử lý lỗi nếu xảy ra trong quá trình đăng nhập
            console.error("Error signing in with Google:", err);
        }
    };

    // Giao diện của nút đăng nhập
    return (
        <Button 
            onClick={signInWithGoogle} // Gọi hàm đăng nhập khi nhấn vào nút
            variant={"secondary"} // Kiểu hiển thị của nút
            className='w-full text-white border-zinc-200 h-11 flex items-center gap-2' // Style tùy chỉnh
        >
            {/* Biểu tượng Google hiển thị bên trái nút */}
            <img src='./img/google.png' alt='Google' className='size-5' />
            Sign in with Google {/* Văn bản hiển thị trên nút */}
        </Button>
    );
};

// Xuất component để sử dụng ở nơi khác
export default SignInOAuthButtons;
