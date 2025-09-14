import { Button } from "@/components/ui/button";  // Lấy component Button từ thư viện UI
import { usePlayerStore } from "@/stores/usePlayerStore";  // Lấy dữ liệu từ store quản lý trình phát nhạc
import { Pause, Play } from "lucide-react";  // Lấy icon Play và Pause từ thư viện lucide-react

const PlayButton = ({ song }) => {
    // Dữ liệu từ store player
    const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
    
    // Kiểm tra xem bài hát hiện tại có phải là bài hát đang được phát không
    const isCurrentSong = currentSong?.id === song.id;

    // Hàm xử lý khi người dùng nhấn vào nút Play/Pause
    const handlePlay = () => {
        // Nếu bài hát hiện tại là bài hát đang phát, thì chuyển đổi trạng thái phát/pause
        if (isCurrentSong) togglePlay();
        // Nếu bài hát hiện tại không phải là bài hát đang phát, thì thay đổi bài hát đang phát
        else setCurrentSong(song);
    };

    return (
        <Button
            size={"icon"}  // Nút có kích thước icon
            onClick={handlePlay}  // Gọi hàm handlePlay khi nhấn nút
            className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
                opacity-0 translate-y-2 group-hover:translate-y-0 ${
                    isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
        >
            {/* Nếu bài hát hiện tại đang phát, hiển thị nút Pause */}
            {isCurrentSong && isPlaying ? (
                <Pause className='size-5 text-black' />
            ) : (
                // Nếu bài hát hiện tại không phát hoặc không phải là bài hát hiện tại, hiển thị nút Play
                <Play className='size-5 text-black' />
            )}
        </Button>
    );
};

export default PlayButton;
