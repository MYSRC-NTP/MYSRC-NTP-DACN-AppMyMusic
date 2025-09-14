import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

const getPersistedIsAdmin = () => {
    try {
        const raw = localStorage.getItem("isAdmin");
        return raw ? JSON.parse(raw) === true : false;
    } catch {
        return false;
    }
};

export const useAuthStore = create((set) => ({
    isAdmin: getPersistedIsAdmin(),
    isLoading: false,
    error: null,

    checkAdminStatus: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/admin/check");
            const isAdmin = Boolean(response.data?.admin);
            set({ isAdmin });
            try { localStorage.setItem("isAdmin", JSON.stringify(isAdmin)); } catch {}
            return isAdmin;
        } catch (error) {
            set({ isAdmin: false, error: error.response?.data?.message || "Error" });
            try { localStorage.setItem("isAdmin", JSON.stringify(false)); } catch {}
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => {
        set({ isAdmin: false, isLoading: false, error: null });
        try { localStorage.removeItem("isAdmin"); } catch {}
    },
}));