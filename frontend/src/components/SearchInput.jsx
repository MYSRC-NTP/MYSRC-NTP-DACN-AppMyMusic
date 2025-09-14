// Import các thành phần cần thiết
import { Input } from "./ui/input"; // Thành phần Input được định nghĩa trong thư mục ui
import { Search } from "lucide-react"; // Biểu tượng tìm kiếm
import { useState, useEffect } from "react"; // Các hook của React
import { useMusicStore } from "../stores/useMusicStore"; // Store chứa logic tìm kiếm bài hát
import SearchResults from "./SearchResults"; // Thành phần hiển thị kết quả tìm kiếm
import { useDebounce } from "../hooks/useDebounce"; // Hook để xử lý debounce

// Định nghĩa component SearchInput
const SearchInput = ({ placeholder = "Tìm kiếm theo tên bài hát hoặc nghệ sĩ..." }) => {
    // State quản lý nội dung tìm kiếm
    const [query, setQuery] = useState("");
    // State để kiểm soát hiển thị kết quả tìm kiếm
    const [showResults, setShowResults] = useState(false);
    
    // Sử dụng store để gọi các hàm và lấy dữ liệu
    const { searchSongs, searchResults, isLoading } = useMusicStore();
    // Hook debounce để giảm tần suất gọi API khi người dùng nhập
    const debouncedQuery = useDebounce(query, 300); // Độ trễ 300ms

    // useEffect theo dõi thay đổi của debouncedQuery
    useEffect(() => {
        if (debouncedQuery) {
            searchSongs(debouncedQuery); // Gọi hàm tìm kiếm khi có nội dung nhập
            setShowResults(true); // Hiển thị kết quả
        }
    }, [debouncedQuery, searchSongs]);

    // Hàm xử lý khi chọn bài hát từ kết quả
    const handleSongSelect = () => {
        setQuery(""); // Xóa nội dung trong ô tìm kiếm
        setShowResults(false); // Ẩn danh sách kết quả
    };

    // Hàm xử lý khi nội dung nhập thay đổi
    const handleInputChange = (e) => {
        const value = e.target.value; // Lấy giá trị từ ô nhập
        setQuery(value); // Cập nhật state query
        if (!value.trim()) {
            setShowResults(false); // Ẩn kết quả nếu không có nội dung
        } else {
            setShowResults(true); // Hiển thị kết quả khi có nội dung
        }
    };

    return (
        <div className="relative max-w-md w-full">
            {/* Biểu tượng tìm kiếm đặt trong ô nhập */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            {/* Ô nhập liệu cho nội dung tìm kiếm */}
            <Input
                value={query} // Giá trị hiện tại trong ô nhập
                onChange={handleInputChange} // Gọi hàm khi nội dung thay đổi
                className="pl-10 bg-zinc-800 border-zinc-700 transition-all duration-200" // Thêm style tùy chỉnh
                placeholder={placeholder} // Hiển thị placeholder
            />
            {/* Hiển thị kết quả tìm kiếm nếu có nội dung hoặc đang tải */}
            {showResults && (query || isLoading || searchResults.length > 0) && (
                <SearchResults 
                    results={searchResults} // Danh sách kết quả từ store
                    isLoading={isLoading && query} // Hiển thị trạng thái đang tải
                    onSongSelect={handleSongSelect} // Xử lý khi chọn bài hát
                />
            )}
        </div>
    );
};

// Xuất component để sử dụng ở nơi khác
export default SearchInput;
