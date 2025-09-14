import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = Router();

// Route lấy danh sách tất cả người dùng (trừ người dùng hiện tại)
// GET /api/users
// Yêu cầu đăng nhập (protectRoute)
router.get("/", protectRoute, getAllUsers);


export default router;
