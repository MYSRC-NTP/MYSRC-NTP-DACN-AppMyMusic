import { clerkClient } from "@clerk/express";

// Middleware bảo vệ route - yêu cầu người dùng phải đăng nhập
export const protectRoute = async (req, res, next) => {
	// Kiểm tra xem có userId trong thông tin xác thực không
	if (!req.auth.userId) {
		// Nếu không có, trả về lỗi 401 Unauthorized
		return res.status(401).json({ message: "Không được phép - bạn phải đăng nhập" });
	}
	// Nếu có userId, cho phép request đi tiếp
	next();
};

// Middleware yêu cầu quyền admin
export const requireAdmin = async (req, res, next) => {
    try {
        // Lấy thông tin người dùng hiện tại từ Clerk
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

        // Nếu không phải admin, chỉ log 1 lần
        if (!isAdmin) {
            console.log(`[requireAdmin] User is not admin. Current user email: ${currentUser.primaryEmailAddress?.emailAddress}, ADMIN_EMAIL: ${process.env.ADMIN_EMAIL}`);
            return res.status(403).json({ message: "Không được phép - bạn phải là quản trị viên" });
        }

        // Nếu là admin, cho phép request đi tiếp
        next();
    } catch (error) {
        // Nếu có lỗi, log lỗi và chuyển đến middleware xử lý lỗi
        console.error("[requireAdmin] Error:", error);
        next(error);
    }
};
