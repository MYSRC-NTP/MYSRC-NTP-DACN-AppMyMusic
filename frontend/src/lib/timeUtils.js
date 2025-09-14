export const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Tính số phút từ tổng số giây
    const remainingSeconds = seconds % 60; // Tính số giây còn lại sau khi đã lấy số phút
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`; // Trả về chuỗi định dạng 'phút:giây', giây sẽ luôn có 2 chữ số
};
