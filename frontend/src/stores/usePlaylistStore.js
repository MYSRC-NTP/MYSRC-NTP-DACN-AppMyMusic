import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

export const usePlaylistStore = create((set, get) => ({
  playlists: [],
  isLoading: false,
  error: null,

  fetchPlaylists: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/playlists");
      set({ playlists: res.data });
    } catch (error) {
      set({ error: "Failed to fetch playlists" });
    } finally {
      set({ isLoading: false });
    }
  },

  createPlaylist: async (name) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/playlists", { name });
      await get().fetchPlaylists();
    } catch (error) {
      set({ error: "Failed to create playlist" });
    } finally {
      set({ isLoading: false });
    }
  },

addSongToPlaylist: async (playlistId, songId) => {
  set({ isLoading: true });
  try {
    // Kiểm tra đã có chưa
    const playlist = get().playlists.find(pl => pl.id === playlistId);
    if (playlist && playlist.songs.some(item => item.song.id === songId)) {
      set({ isLoading: false });
      return { status: "exists" };
    }
    await axiosInstance.post(`/playlists/${playlistId}/songs`, { songId });
    await get().fetchPlaylists();
    set({ isLoading: false });
    return { status: "success" };
  } catch (error) {
    set({ error: "Failed to add song", isLoading: false });
    return { status: "error" };
  }
},

  removeSongFromPlaylist: async (playlistId, songId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/playlists/${playlistId}/songs/${songId}`);
      await get().fetchPlaylists();
    } catch (error) {
      set({ error: "Failed to remove song" });
    } finally {
      set({ isLoading: false });
    }
  },
//bỏ
  deletePlaylist: async (playlistId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/playlists/${playlistId}`);
      await get().fetchPlaylists();
    } catch (error) {
      set({ error: "Failed to delete playlist" });
    } finally {
      set({ isLoading: false });
    }
  },
  updatePlaylist: async (playlistId, name) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put(`/playlists/${playlistId}`, { name });
      await get().fetchPlaylists();
    } catch (error) {
      set({ error: "Failed to update playlist" });
    } finally {
      set({ isLoading: false });
    }
  },
}));