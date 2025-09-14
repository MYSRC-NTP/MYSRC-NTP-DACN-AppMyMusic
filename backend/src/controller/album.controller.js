import { prisma } from "../lib/db.js";

// Controller lấy tất cả album
export const getAllAlbums = async (req, res, next) => {
    try {
        const albums = await prisma.album.findMany({
            include: { artist: true }
        });
        // Map lại để trả về artist là tên nghệ sĩ
        const mapped = albums.map(album => ({
            ...album,
            artist: album.artist?.name || ""
        }));
        res.status(200).json(mapped);
    } catch (error) {
        next(error);
    }
};

// Controller lấy thông tin chi tiết của một album theo ID
export const getAlbumById = async (req, res, next) => {
    try {
        const { albumId } = req.params;
        const album = await prisma.album.findUnique({
            where: { id: albumId },
            include: { songs: true },
        });
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }
        res.status(200).json(album);
    } catch (error) {
        next(error);
    }
};