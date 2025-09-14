import { prisma } from "../lib/db.js";

// Controller lấy thống kê tổng quan của hệ thống
export const getStats = async (req, res, next) => {
    try {
        const [totalSongs, totalAlbums, totalUsers, totalArtists] = await Promise.all([
            prisma.song.count(),
            prisma.album.count(),
            prisma.user.count(),
            prisma.artist.count(),
        ]);

        res.status(200).json({
            totalAlbums,
            totalSongs,
            totalUsers,
            totalArtists,
        });
    } catch (error) {
        next(error);
    }
};