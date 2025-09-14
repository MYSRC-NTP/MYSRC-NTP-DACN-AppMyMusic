import Topbar from "@/components/Topbar"; // Import phần header trên cùng của trang
import { useMusicStore } from "@/stores/useMusicStore"; // Sử dụng store để truy xuất các bài hát và trạng thái tải dữ liệu
import { useEffect, useMemo } from "react"; // Hook để thực thi các hành động khi component được render
import FeaturedSection from "./components/FeaturedSection"; // Section hiển thị các bài hát nổi bật
import { ScrollArea } from "@/components/ui/scroll-area"; // Thành phần để tạo scrollable area cho nội dung
import SectionGrid from "./components/SectionGrid"; // Component hiển thị các bài hát theo grid
import { usePlayerStore } from "@/stores/usePlayerStore"; // Sử dụng store để quản lý trạng thái của player nhạc

// Hàm random mảng
function shuffle(arr) {
  return arr.slice().sort(() => 0.5 - Math.random());
}

const HomePage = () => {
  // Lấy các hàm và dữ liệu từ useMusicStore
  const {
    fetchFeaturedSongs, // Hàm lấy danh sách bài hát nổi bật
    fetchMadeForYouSongs, // Hàm lấy danh sách bài hát gợi ý cho người dùng
    fetchTrendingSongs, // Hàm lấy danh sách bài hát xu hướng
    isLoading, // Biến trạng thái cho biết dữ liệu đang được tải
    madeForYouSongs, // Dữ liệu các bài hát "Made For You"
    featuredSongs, // Dữ liệu các bài hát nổi bật
    trendingSongs, // Dữ liệu các bài hát xu hướng
  } = useMusicStore();

  // Lấy hàm từ usePlayerStore để khởi tạo queue nhạc
  const { initializeQueue } = usePlayerStore();

  // useEffect đầu tiên để lấy dữ liệu các bài hát khi component được mount
  useEffect(() => {
    fetchFeaturedSongs(); // Lấy các bài hát nổi bật
    fetchMadeForYouSongs(); // Lấy các bài hát gợi ý cho người dùng
    fetchTrendingSongs(); // Lấy các bài hát xu hướng
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  // useEffect thứ hai để khởi tạo queue nhạc sau khi các bài hát được tải đầy đủ
  useEffect(() => {
    // Kiểm tra nếu tất cả bài hát đã được tải
    if (
      madeForYouSongs.length > 0 &&
      featuredSongs.length > 0 &&
      trendingSongs.length > 0
    ) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs]; // Kết hợp tất cả các bài hát lại với nhau
      initializeQueue(allSongs); // Khởi tạo hàng đợi cho player
    }
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  const shuffledMadeForYou = useMemo(
    () => shuffle(madeForYouSongs),
    [madeForYouSongs]
  );
  const shuffledTrending = useMemo(
    () => shuffle(trendingSongs),
    [trendingSongs]
  );

  // Phần JSX để render giao diện người dùng
  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar /> {/* Header của trang */}
      <ScrollArea className="h-[calc(100vh-180px)]">
        {" "}
        {/* Vùng cuộn của nội dung chính */}
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Have a good day !
          </h1>{" "}
          {/* Tiêu đề chào người dùng */}
          <FeaturedSection /> {/* Phần hiển thị các bài hát nổi bật */}
          <div className="space-y-8">
            {/* Các phần hiển thị bài hát với các tiêu đề khác nhau */}
            <SectionGrid
              title="Made For You"
              songs={shuffledMadeForYou}
              isLoading={isLoading}
              allowExpand={true}
            />
            <SectionGrid
              title="Trending"
              songs={shuffledTrending}
              isLoading={isLoading}
              allowExpand={true}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;
