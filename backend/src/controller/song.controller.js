import { prisma } from "../lib/db.js";

// Lấy 12 bài hát ngẫu nhiên
export const getMoreSongs = async (req, res, next) => {
    try {
        const songs = await prisma.song.findMany({
            take: 6, 
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                artist: true,
                imageUrl: true,
                audioUrl: true,
            },
        });
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

// Tìm kiếm bài hát theo tên hoặc nghệ sĩ
export const searchSongs = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);
        const songs = await prisma.song.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { artist: { is: { name: { contains: query, mode: "insensitive" } } } },
                ],
            },
            take: 10,
            include: { artist: true },
        });
        const mapped = songs.map((song) => ({
            id: song.id,
            title: song.title,
            artist: song.artist?.name || "",
            imageUrl: song.imageUrl,
            audioUrl: song.audioUrl,
        }));
        res.json(mapped);
    } catch (error) {
        next(error);
    }
};

// Lấy tất cả bài hát
export const getAllSongs = async (req, res, next) => {
    try {
        const songs = await prisma.song.findMany({
            orderBy: { createdAt: "desc" },
            include: { artist: true }
        });
        const mapped = songs.map(song => ({
            ...song,
            artist: song.artist?.name || ""
        }));
        res.json(mapped);
    } catch (error) {
        next(error);
    }
};

// Lấy 6 bài hát random trong toàn bộ database cho 'Have a good day !'
export const getFeaturedSongs = async (req, res, next) => {
    try {
        const allSongs = await prisma.song.findMany({
            select: {
                id: true,
                title: true,
                artist: { select: { name: true } },
                imageUrl: true,
                audioUrl: true,
            },
        });
        const shuffled = allSongs.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        const mapped = selected.map(song => ({
            ...song,
            artist: song.artist?.name || ""
        }));
        res.json(mapped);
    } catch (error) {
        next(error);
    }
};

// Lấy 30 bài hát mới nhất cho Made For You
export const getMadeForYouSongs = async (req, res, next) => {
    try {
        const songs = await prisma.song.findMany({
            take: 30,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                artist: { select: { name: true } },
                imageUrl: true,
                audioUrl: true,
            },
        });
        const mapped = songs.map(song => ({
            ...song,
            artist: song.artist?.name || ""
        }));
        res.json(mapped);
    } catch (error) {
        next(error);
    }
};

// Lấy 30 bài hát mới nhất cho Trending
export const getTrendingSongs = async (req, res, next) => {
    try {
        const songs = await prisma.song.findMany({
            take: 30,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                artist: { select: { name: true } },
                imageUrl: true,
                audioUrl: true,
            },
        });
        const mapped = songs.map(song => ({
            ...song,
            artist: song.artist?.name || ""
        }));
        res.json(mapped);
    } catch (error) {
        next(error);
    }
};