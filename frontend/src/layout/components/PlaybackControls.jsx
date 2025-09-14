import { Button } from "@/components/ui/button"; // Import Button component từ thư mục UI
import { Slider } from "@/components/ui/slider"; // Import Slider component từ thư mục UI
import { usePlayerStore } from "@/stores/usePlayerStore"; // Import hook để quản lý trạng thái của player
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1 } from "lucide-react"; // Import các biểu tượng từ lucide-react
import { useEffect, useRef, useState } from "react"; // Import các hook React như useState, useEffect, useRef

// Hàm định dạng thời gian (phút:giây) từ số giây
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Tính số phút
    const remainingSeconds = Math.floor(seconds % 60); // Tính số giây còn lại
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`; // Trả về chuỗi thời gian dạng "phút:giây"
};

export const PlaybackControls = () => {
    const { currentSong, isPlaying, togglePlay, playNext, playPrevious, isShuffling, repeatMode, toggleShuffle, toggleRepeat } = usePlayerStore(); 
    // Sử dụng hook để lấy các trạng thái và hành động từ store như bài hát hiện tại, trạng thái chơi, lệnh điều khiển nhạc (play, next, previous), chế độ shuffle, repeat.

    const [volume, setVolume] = useState(75); // Quản lý trạng thái volume (mặc định là 75)
    const [currentTime, setCurrentTime] = useState(0); // Quản lý trạng thái thời gian hiện tại của bài hát
    const [duration, setDuration] = useState(0); // Quản lý trạng thái tổng thời gian của bài hát
    const audioRef = useRef(null); // Tạo ref cho thẻ audio

    // Dùng useEffect để cập nhật thời gian bài hát và độ dài bài hát khi audio được tải
    useEffect(() => {
        audioRef.current = document.querySelector("audio"); // Tìm phần tử audio trên trang

        const audio = audioRef.current;
        if (!audio) return;

        // Cập nhật thời gian hiện tại khi bài hát đang phát
        const updateTime = () => setCurrentTime(audio.currentTime);
        // Cập nhật thời gian tổng của bài hát khi metadata đã được tải
        const updateDuration = () => setDuration(audio.duration);

        // Thêm các sự kiện cho audio: timeupdate, loadedmetadata
        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);

        // Xử lý khi bài hát kết thúc (nếu chế độ lặp lại là 'ONE', bài hát sẽ tự động lặp lại, nếu không sẽ phát bài tiếp theo)
        const handleEnded = () => {
            if (repeatMode === 'ONE') {
                if (audioRef.current) {
                    audioRef.current.currentTime = 0; // Đưa về đầu bài hát
                    audioRef.current.play(); // Phát lại bài hát
                }
            } else {
                playNext(); // Chuyển sang bài hát tiếp theo
            }
        };

        audio.addEventListener("ended", handleEnded);

        // Dọn dẹp sự kiện khi component bị huỷ bỏ
        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [currentSong, playNext, repeatMode]); // Hook chỉ chạy lại khi các giá trị này thay đổi

    // Hàm xử lý khi kéo thanh trượt thời gian (seek)
    const handleSeek = (value) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0]; // Thay đổi thời gian của audio
        }
    };

    return (
        <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
            <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
                {/* Hiển thị bài hát hiện tại */}
                <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
                    {currentSong && (
                        <>
                            <img
                                src={currentSong.imageUrl}
                                alt={currentSong.title}
                                className="w-14 h-14 object-cover rounded-md"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate hover:underline cursor-pointer">
                                    {currentSong.title}
                                </div>
                                <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                                    {currentSong.artist}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Các điều khiển phát nhạc */}
                <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Nút shuffle (xáo trộn) */}
                        <Button
                            size="icon"
                            variant="ghost"
                            className={`hidden sm:inline-flex hover:text-white ${isShuffling ? 'text-green-500' : 'text-zinc-400'}`}
                            onClick={toggleShuffle}
                        >
                            <Shuffle className={`h-4 w-4 ${isShuffling ? 'animate-pulse' : ''}`} />
                        </Button>

                        {/* Nút quay lại bài trước */}
                        <Button
                            size="icon"
                            variant="ghost"
                            className="hover:text-white text-zinc-400"
                            onClick={playPrevious}
                            disabled={!currentSong}
                        >
                            <SkipBack className="h-4 w-4" />
                        </Button>

                        {/* Nút phát/tạm dừng */}
                        <Button
                            size="icon"
                            className="bg-white hover:bg-white/80 text-black rounded-full h-8 w-8"
                            onClick={togglePlay}
                            disabled={!currentSong}
                        >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>

                        {/* Nút tiếp theo */}
                        <Button
                            size="icon"
                            variant="ghost"
                            className="hover:text-white text-zinc-400"
                            onClick={playNext}
                            disabled={!currentSong}
                        >
                            <SkipForward className="h-4 w-4" />
                        </Button>

                        {/* Nút lặp lại */}
                        <Button
                            size="icon"
                            variant="ghost"
                            className={`hidden sm:inline-flex hover:text-white ${repeatMode !== 'OFF' ? 'text-green-500' : 'text-zinc-400'}`}
                            onClick={toggleRepeat}
                        >
                            <div className="relative">
                                <Repeat className={`h-4 w-4 ${repeatMode !== 'OFF' ? 'animate-pulse' : ''}`} />
                                {repeatMode === 'ONE' && (
                                    <span className="absolute -top-1 -right-1 text-[10px] font-bold">1</span>
                                )}
                            </div>
                        </Button>
                    </div>

                    {/* Thanh trượt thời gian */}
                    <div className="hidden sm:flex items-center gap-2 w-full">
                        <div className="text-xs text-zinc-400">{formatTime(currentTime)}</div>
                        <Slider
                            value={[currentTime]}
                            max={duration || 100}
                            step={1}
                            className="w-full hover:cursor-grab active:cursor-grabbing"
                            onValueChange={handleSeek}
                        />
                        <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
                    </div>
                </div>

                {/* Điều khiển âm lượng */}
                <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
                            <Volume1 className="h-4 w-4" />
                        </Button>

                        <Slider
                            value={[volume]}
                            max={100}
                            step={1}
                            className="w-24 hover:cursor-grab active:cursor-grabbing"
                            onValueChange={(value) => {
                                setVolume(value[0]);
                                if (audioRef.current) {
                                    audioRef.current.volume = value[0] / 100; // Cập nhật âm lượng của audio
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};
