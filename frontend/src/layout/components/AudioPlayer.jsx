// Import hook từ React và store quản lý trạng thái phát nhạc
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

// Định nghĩa component AudioPlayer
const AudioPlayer = () => {
    // Sử dụng useRef để tạo tham chiếu đến phần tử <audio> và lưu trữ bài hát trước đó
    const audioRef = useRef(null);
    const prevSongRef = useRef(null);

    // Lấy các trạng thái từ store player (bài hát hiện tại, trạng thái phát nhạc, hàm phát bài hát tiếp theo)
    const { currentSong, isPlaying, playNext } = usePlayerStore();

    // useEffect để xử lý logic phát/pause nhạc
    useEffect(() => {
        // Nếu đang phát nhạc, gọi play, nếu không thì pause
        if (isPlaying) audioRef.current?.play();
        else audioRef.current?.pause();
    }, [isPlaying]); // Chạy lại khi trạng thái isPlaying thay đổi

    // useEffect để xử lý khi bài hát kết thúc
    useEffect(() => {
        const audio = audioRef.current;

        // Hàm xử lý khi bài hát kết thúc, sẽ tự động phát bài tiếp theo
        const handleEnded = () => {
            playNext(); // Gọi hàm playNext từ store để phát bài tiếp theo
        };

        // Gắn sự kiện 'ended' vào phần tử audio
        audio?.addEventListener("ended", handleEnded);

        // Dọn dẹp khi component bị unmount hoặc khi playNext thay đổi
        return () => audio?.removeEventListener("ended", handleEnded);
    }, [playNext]); // Chạy lại khi hàm playNext thay đổi

    // useEffect để xử lý khi bài hát thay đổi
    useEffect(() => {
        if (!audioRef.current || !currentSong) return; // Kiểm tra nếu không có bài hát hoặc phần tử audio

        const audio = audioRef.current;

        // Kiểm tra xem có phải là bài hát mới không (so sánh URL audio)
        const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
        if (isSongChange) {
            audio.src = currentSong?.audioUrl; // Cập nhật nguồn âm thanh mới
            audio.currentTime = 0; // Đặt lại thời gian phát lại về 0 (bắt đầu từ đầu)

            prevSongRef.current = currentSong?.audioUrl; // Cập nhật bài hát trước đó

            // Nếu đang phát nhạc, tự động phát bài hát mới
            if (isPlaying) audio.play();
        }
    }, [currentSong, isPlaying]); // Chạy lại khi bài hát (currentSong) hoặc trạng thái isPlaying thay đổi

    return <audio ref={audioRef} />; // Trả về phần tử audio với ref đã được gắn
};

export default AudioPlayer;
