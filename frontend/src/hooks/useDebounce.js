// Import các hook cần thiết từ React
import { useEffect, useState } from "react";

// Định nghĩa hook tùy chỉnh useDebounce
export function useDebounce(value, delay) {
    // Tạo state để lưu trữ giá trị debounce
    const [debouncedValue, setDebouncedValue] = useState(value);

    // useEffect sẽ được gọi mỗi khi 'value' hoặc 'delay' thay đổi
    useEffect(() => {
        // Thiết lập một bộ đếm thời gian để cập nhật giá trị debounce sau khoảng thời gian 'delay'
        const handler = setTimeout(() => {
            setDebouncedValue(value); // Cập nhật giá trị debounce khi bộ đếm kết thúc
        }, delay);

        // Hàm dọn dẹp: Xóa bộ đếm nếu 'value' hoặc 'delay' thay đổi trước khi thời gian hết
        return () => {
            clearTimeout(handler); // Đảm bảo chỉ giữ lại bộ đếm cuối cùng
        };
    }, [value, delay]); // Các phụ thuộc: Khi 'value' hoặc 'delay' thay đổi, effect sẽ được kích hoạt lại

    // Trả về giá trị debounce
    return debouncedValue;
}
