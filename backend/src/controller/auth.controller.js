import { prisma } from "../lib/db.js";

// Controller xử lý callback sau khi xác thực từ Clerk
export const authCallback = async (req, res, next) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;

        // Kiểm tra xem người dùng đã tồn tại trong database chưa
        const user = await prisma.user.findUnique({ where: { clerkId: id } });

        if (!user) {
            // Nếu chưa tồn tại, tạo người dùng mới
            const newUser = await prisma.user.create({
                data: {
                    clerkId: id,
                    fullName: `${firstName || ""} ${lastName || ""}`.trim(),
                    imageUrl,
                },
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.log("Error in auth callback", error);
        next(error);
    }
};