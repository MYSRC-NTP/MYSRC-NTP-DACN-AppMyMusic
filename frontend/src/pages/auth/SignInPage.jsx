import { SignIn } from "@clerk/clerk-react"; // Nhập component SignIn từ thư viện Clerk

const SignInPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900 p-4">
            {/* Thiết lập giao diện trang đăng nhập */}
            <SignIn 
                routing="path" // Định nghĩa phương thức điều hướng sau khi đăng nhập là "path", tức là sử dụng URL đường dẫn
                path="/sign-in" // Định nghĩa URL cho trang đăng nhập
                signUpUrl="/sign-up" // Đường dẫn tới trang đăng ký
                redirectUrl="/auth-callback" // Đường dẫn sẽ chuyển hướng sau khi đăng nhập thành công
                appearance={{
                    elements: {
                        rootBox: "mx-auto", // Căn giữa hộp chứa
                        card: "bg-zinc-900 border border-zinc-800", // Thiết lập kiểu thẻ (card) của form đăng nhập
                        headerTitle: "text-white", // Màu chữ của tiêu đề trong phần đầu trang
                        headerSubtitle: "text-zinc-400", // Màu chữ của phụ đề trong phần đầu trang
                        socialButtonsBlockButton: "bg-zinc-800 hover:bg-zinc-700 text-white", // Màu nền và hover của các nút đăng nhập mạng xã hội
                        formButtonPrimary: "bg-green-500 hover:bg-green-600 text-white", // Màu nền và hover của nút chính (đăng nhập)
                        footerActionLink: "text-green-500 hover:text-green-400" // Màu của liên kết ở cuối trang (liên kết đăng ký)
                    }
                }}
                afterSignInUrl="/auth-callback" // Đường dẫn chuyển hướng sau khi đăng nhập thành công
                signInUrl="/sign-in" // Đường dẫn trang đăng nhập
            />
        </div>
    );
};

export default SignInPage;
