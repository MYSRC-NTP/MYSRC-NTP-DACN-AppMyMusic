import { prisma } from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";

// Lấy danh sách nghệ sĩ
export const getAllArtists = async (req, res, next) => {
    try {
        const artists = await prisma.artist.findMany({
            orderBy: { name: "asc" }
        });
        res.json(artists);
    } catch (error) {
        next(error);
    }
};

// Lấy chi tiết nghệ sĩ (bao gồm bài hát, album)
export const getArtistDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const artist = await prisma.artist.findUnique({
            where: { id },
            include: {
                songs: true,
                albums: true
            }
        });
        if (!artist) return res.status(404).json({ message: "Artist not found" });
        res.json(artist);
    } catch (error) {
        next(error);
    }
};

// Tạo nghệ sĩ mới
export const createArtist = async (req, res, next) => {
    try {
        const { name, bio } = req.body;
        let imageUrl = "";
        if (req.files?.imageFile) {
            const result = await cloudinary.uploader.upload(req.files.imageFile.tempFilePath, {
                resource_type: "image",
            });
            imageUrl = result.secure_url;
        }
        const artist = await prisma.artist.create({
            data: { name, imageUrl, bio }
        });
        res.status(201).json(artist);
    } catch (error) {
        next(error);
    }
};

// Cập nhật nghệ sĩ
export const updateArtist = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, bio } = req.body;
        let data = { name, bio };

        // Nếu có file ảnh mới thì upload lên Cloudinary
        if (req.files?.imageFile) {
            const result = await cloudinary.uploader.upload(req.files.imageFile.tempFilePath, {
                resource_type: "image",
            });
            data.imageUrl = result.secure_url;
        }

        const artist = await prisma.artist.update({
            where: { id },
            data,
        });
        res.json(artist);
    } catch (error) {
        next(error);
    }
};

// Xóa nghệ sĩ
export const deleteArtist = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Kiểm tra xem còn bài hát hoặc album liên quan không
        const [songCount, albumCount] = await Promise.all([
            prisma.song.count({ where: { artistId: id } }),
            prisma.album.count({ where: { artistId: id } }),
        ]);
        if (songCount > 0 || albumCount > 0) {
            return res.status(400).json({
                message: `Không thể xóa nghệ sĩ này vì còn ${songCount} bài hát và ${albumCount} album liên quan. Nếu muốn xóa, hãy xóa hết các bài hát và album trước.`
            });
        }
        // Nếu không còn liên quan thì xóa
        await prisma.artist.delete({ where: { id } });
        res.json({ message: "Artist deleted" });
    } catch (error) {
        next(error);
    }
}; 
