import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

// Hàm cập nhật token vào header của axios
const updateApiToken = (token) => {
  if (token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }) => {
  const { getToken, userId, isSignedIn, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus, reset } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!isLoaded) return; // đợi Clerk sẵn sàng
        if (!isSignedIn) {
          updateApiToken(null);
          reset();
          return;
        }

        // Lấy session token từ Clerk (đợi nếu tạm thời chưa có)
        let token = await getToken();
        if (!token) {
          for (let i = 0; i < 10 && !token; i++) {
            await new Promise((r) => setTimeout(r, 100));
            token = await getToken();
          }
        }
        updateApiToken(token || null);

        if (token) {
          await checkAdminStatus();
        }
      } catch (error) {
        updateApiToken(null);
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [getToken, userId, isSignedIn, isLoaded, checkAdminStatus, reset]);

  // Đảm bảo mọi request luôn dùng token mới nhất (khi chuyển account)
  useEffect(() => {
    const interceptorId = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const freshToken = await getToken();
          if (freshToken) config.headers.Authorization = `Bearer ${freshToken}`;
          else delete config.headers.Authorization;
        } catch (_) {
          delete config.headers.Authorization;
        }
        return config;
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptorId);
    };
  }, [getToken]);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );

  return <>{children}</>;
};

export default AuthProvider;
