import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";

export const useMusicStore = create((set) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    madeForYouSongs: [],
    featuredSongs: [],
    trendingSongs: [],
    searchResults: [],
    stats: {
        totalSongs: 0,
        totalAlbums: 0,
        totalUsers: 0,
        totalArtists: 0,
    },

    deleteSong: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/admin/songs/${id}`);
            set((state) => ({
                songs: state.songs.filter((song) => song.id !== id),
            }));
            toast.success("Song deleted successfully");
        } catch (error) {
            toast.error("Error deleting song");
        } finally {
            set({ isLoading: false });
        }
    },

    deleteAlbum: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/admin/albums/${id}`);
            set((state) => ({
                albums: state.albums.filter((album) => album.id !== id),
                songs: state.songs.map((song) =>
                    song.albumId === id ? { ...song, album: null } : song
                ),
            }));
            toast.success("Album deleted successfully");
        } catch (error) {
            toast.error("Failed to delete album");
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/songs");
            set({ songs: res.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch songs", isLoading: false });
        }
    },

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/stats");
            set({ stats: res.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch stats", isLoading: false });
        }
    },

    fetchAlbums: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/albums");
            set({ albums: res.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch albums", isLoading: false });
        }
    },

    fetchAlbumById: async (id) => {
        if (!id) return;
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get(`/albums/${id}`);
            set({ currentAlbum: res.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch album", isLoading: false });
        }
    },

    fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/songs/featured");
            set({ featuredSongs: res.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch featured songs", isLoading: false });
        }
    },

    fetchMadeForYouSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/songs/made-for-you");
            set({ madeForYouSongs: res.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch made for you songs", isLoading: false });
        }
    },

    fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/songs/trending");
            set({ trendingSongs: res.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch trending songs", isLoading: false });
        }
    },

    searchSongs: async (query) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get(`/songs/search?query=${encodeURIComponent(query)}`);
            set({ searchResults: res.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to search songs", isLoading: false });
        }
    },

    clearSearch: () => set({ searchResults: [] }),

    getMoreSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/songs/more");
            set((state) => ({
                songs: [...state.songs, ...res.data],
                isLoading: false,
            }));
        } catch (error) {
            set({ error: "Failed to get more songs", isLoading: false });
        }
    },
}));