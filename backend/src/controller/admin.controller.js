import { prisma } from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";

// Hàm hỗ trợ upload file lên Cloudinary
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        });
        return result.secure_url;
    } catch (error) {
        console.log("Error in uploadToCloudinary", error);
        throw new Error("Error uploading to cloudinary");
    }
};

// Controller tạo bài hát mới
export const createSong = async (req, res, next) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Please upload all files" });
        }

        const { title, artistId, albumId } = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        if (!artistId) {
            return res.status(400).json({ message: "artistId is required" });
        }

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        const song = await prisma.song.create({
            data: {
                title,
                artistId,
                audioUrl,
                imageUrl,
                albumId: albumId || null,
            },
        });

        res.status(201).json(song);
    } catch (error) {
        console.log("Error in createSong", error);
        next(error);
    }
};

// Controller xóa bài hát
export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        const song = await prisma.song.findUnique({ where: { id } });

        await prisma.song.delete({ where: { id } });

        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        console.log("Error in deleteSong", error);
        next(error);
    }
};

//cập nhật Album
export const updateAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, artistId } = req.body;
        let data = { title, artistId };

        if (!artistId) {
            return res.status(400).json({ message: "artistId is required" });
        }

        if (req.files?.imageFile) {
            data.imageUrl = await uploadToCloudinary(req.files.imageFile);
        }

        const album = await prisma.album.update({
            where: { id },
            data,
        });

        res.status(200).json(album);
    } catch (error) {
        next(error);
    }
};

//cập nhật bài hát 
export const updateSong = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, artistId, albumId } = req.body;
        let data = { title, artistId, albumId: albumId || null };

        if (!artistId) {
            return res.status(400).json({ message: "artistId is required" });
        }

        // Nếu có file mới thì upload lên Cloudinary
        if (req.files?.imageFile) {
            data.imageUrl = await uploadToCloudinary(req.files.imageFile);
        }
        if (req.files?.audioFile) {
            data.audioUrl = await uploadToCloudinary(req.files.audioFile);
        }

        const song = await prisma.song.update({
            where: { id },
            data,
        });

        res.status(200).json(song);
    } catch (error) {
        console.log("Error in updateSong", error);
        next(error);
    }
};

// Controller tạo album mới
export const createAlbum = async (req, res, next) => {
    try {
        const { title, artistId, releaseYear } = req.body;
        const { imageFile } = req.files;
        if (!artistId) {
            return res.status(400).json({ message: "artistId is required" });
        }
        const imageUrl = await uploadToCloudinary(imageFile);
        const album = await prisma.album.create({
            data: {
                title,
                artistId,
                imageUrl,
                releaseYear: Number(releaseYear),
            },
        });
        res.status(201).json(album);
    } catch (error) {
        console.log("Error in createAlbum", error);
        next(error);
    }
};

// Controller xóa album
export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.song.deleteMany({ where: { albumId: id } });
        await prisma.album.delete({ where: { id } });
        res.status(200).json({ message: "Album deleted successfully" });
    } catch (error) {
        console.log("Error in deleteAlbum", error);
        next(error);
    }
};

// Controller kiểm tra quyền admin
export const checkAdmin = async (req, res, next) => {
    res.status(200).json({ admin: true });
};