import { prisma } from "../lib/db.js";

// Tạo playlist mới
export const createPlaylist = async (req, res, next) => {
  try {
    const { name } = req.body;
    const clerkId = req.auth.userId;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Tên playlist không được để trống" });
    }

    // Tìm user theo clerkId
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Kiểm tra số lượng playlist tối đa
    const count = await prisma.playlist.count({ where: { userId: user.id } });
    if (count >= 5) {
      return res.status(400).json({ message: "Bạn chỉ được tạo tối đa 5 playlist" });
    }

    // Kiểm tra user đã có playlist cùng tên chưa
    const existingPlaylist = await prisma.playlist.findFirst({
      where: { userId: user.id, name },
    });
    if (existingPlaylist) {
      return res.status(400).json({ message: "Tên playlist đã tồn tại" });
    }

    // Tạo playlist với userId là id của user
    const playlist = await prisma.playlist.create({
      data: { name, userId: user.id },
    });
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

// Lấy tất cả playlist của user
export const getUserPlaylists = async (req, res, next) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const playlists = await prisma.playlist.findMany({
      where: { userId: user.id },
      include: {
        songs: {
          include: { song: true },
        },
      },
    });
    res.json(playlists);
  } catch (error) {
    next(error);
  }
};

// Thêm bài hát vào playlist
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;
    const playlistSong = await prisma.playlistSong.create({
      data: { playlistId, songId },
    });
    res.status(201).json(playlistSong);
  } catch (error) {
    next(error);
  }
};

// Xóa bài hát khỏi playlist
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;
    await prisma.playlistSong.deleteMany({
      where: { playlistId, songId },
    });
    res.status(200).json({ message: "Removed" });
  } catch (error) {
    next(error);
  }
};

// Đổi tên playlist
export const updatePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { name } = req.body;
    const clerkId = req.auth.userId;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Tên playlist không được để trống" });
    }

    // Tìm user theo clerkId
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Kiểm tra playlist thuộc user
    const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist || playlist.userId !== user.id) {
      return res.status(404).json({ message: "Playlist không tồn tại hoặc không thuộc về bạn" });
    }

    // Kiểm tra trùng tên
    const existing = await prisma.playlist.findFirst({
      where: { userId: user.id, name, NOT: { id: playlistId } },
    });
    if (existing) {
      return res.status(400).json({ message: "Tên playlist đã tồn tại" });
    }

    const updated = await prisma.playlist.update({
      where: { id: playlistId },
      data: { name },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Xóa playlist
export const deletePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const clerkId = req.auth.userId;

    // Tìm user theo clerkId
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Kiểm tra playlist thuộc user
    const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist || playlist.userId !== user.id) {
      return res.status(404).json({ message: "Playlist không tồn tại hoặc không thuộc về bạn" });
    }

    // Xóa tất cả bài hát trong playlist
    await prisma.playlistSong.deleteMany({ where: { playlistId } });
    // Xóa playlist
    await prisma.playlist.delete({ where: { id: playlistId } });
    res.json({ message: "Đã xóa playlist" });
  } catch (error) {
    next(error);
  }
};
