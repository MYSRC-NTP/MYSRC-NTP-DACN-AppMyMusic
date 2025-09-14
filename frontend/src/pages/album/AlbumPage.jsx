import { Button } from "@/components/ui/button"; // Nhập component Button từ thư viện UI
import { ScrollArea } from "@/components/ui/scroll-area"; // Nhập component ScrollArea để hiển thị vùng cuộn
import { useMusicStore } from "@/stores/useMusicStore"; // Nhập hook quản lý dữ liệu âm nhạc
import { usePlayerStore } from "@/stores/usePlayerStore"; // Nhập hook quản lý dữ liệu người chơi nhạc
import { Clock, Pause, Play, Shuffle, Repeat } from "lucide-react"; // Nhập các biểu tượng từ lucide-react
import { useEffect } from "react"; // Nhập hook useEffect để thực hiện các tác vụ khi component mount
import { useParams } from "react-router-dom"; // Nhập hook useParams để lấy thông tin từ URL
import { formatDuration } from "@/lib/timeUtils"; // Nhập hàm formatDuration để định dạng thời gian bài hát

// Component chính của trang album
const AlbumPage = () => {
  const { albumId } = useParams(); // Lấy id của album từ URL
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore(); // Lấy các hàm và dữ liệu album từ store
  const {
    currentSong,
    isPlaying,
    playAlbum,
    togglePlay,
    toggleShuffle,
    toggleRepeat,
    isShuffling,
    isRepeating,
  } = usePlayerStore(); // Lấy các hàm và trạng thái của player

  // Tải album khi component được render
  useEffect(() => {
    if (albumId) fetchAlbumById(albumId); // Nếu có albumId, gọi hàm fetchAlbumById để tải album
  }, [fetchAlbumById, albumId]); // Chạy lại khi albumId thay đổi

  // Nếu album đang được tải, không hiển thị gì
  if (isLoading) return null;

  // Hàm xử lý phát album
  const handlePlayAlbum = () => {
    if (!currentAlbum) return; // Nếu không có album, không làm gì

    // Kiểm tra xem bài hát hiện tại có phải là một trong các bài hát của album không
    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song.id === currentSong?.id
    );
    if (isCurrentAlbumPlaying)
      togglePlay(); // Nếu đang phát bài hát trong album, tạm dừng phát
    else {
      // Nếu không, bắt đầu phát album từ bài hát đầu tiên
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  // Hàm xử lý phát bài hát theo index
  const handlePlaySong = (index) => {
    if (!currentAlbum) return; // Nếu không có album, không làm gì

    // Phát album bắt đầu từ bài hát có index tương ứng
    playAlbum(currentAlbum?.songs, index);
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        {/* Nội dung chính của trang */}
        <div className="relative min-h-full">
          {/* Màu nền gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
                        to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* Nội dung chính */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              {/* Hình ảnh album */}
              <img
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className="w-[240px] h-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentAlbum?.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span>• {currentAlbum?.songs.length} songs</span>
                  <span>• {currentAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>

            {/* Các nút điều khiển */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={toggleShuffle}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Shuffle className="h-5 w-5" />
              </Button>
              <Button
                onClick={toggleRepeat}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <Repeat className="h-5 w-5" />
              </Button>
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 
                                hover:scale-105 transition-all"
              >
                {isPlaying &&
                currentAlbum?.songs.some(
                  (song) => song.id === currentSong?.id
                ) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
            </div>

            {/* Phần danh sách bài hát */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* Đầu bảng */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
                                text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* Danh sách bài hát */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?.id === song.id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)} // Khi người dùng nhấn vào bài hát, phát bài hát đó
                        className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                                                text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-green-500">♫</div> // Hiển thị ký hiệu khi bài hát đang phát
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" /> // Hiển thị biểu tượng Play khi hover
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10"
                          />{" "}
                          {/* Hình ảnh của bài hát */}
                          <div>
                            <div className={`font-medium text-white`}>
                              {song.title}
                            </div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {song.createdAt.split("T")[0]}
                        </div>{" "}
                        {/* Ngày phát hành */}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
