// Định nghĩa một component có tên 'FeaturedGridSkeleton'
const FeaturedGridSkeleton = () => {
    // Trả về JSX (HTML trong React) cho giao diện loading
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
            {/* Dùng Array.from để tạo một mảng có 6 phần tử, đại diện cho 6 item loading */}
            {Array.from({ length: 6 }).map((_, i) => (
                // Mỗi item trong mảng được hiển thị dưới dạng một div với key là chỉ số i
                <div key={i} className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden animate-pulse'>
                    {/* Div này đại diện cho ảnh hoặc biểu tượng, có chiều rộng cố định và chiều cao thay đổi theo kích thước màn hình */}
                    <div className='w-16 sm:w-20 h-16 sm:h-20 bg-zinc-700 flex-shrink-0' />
                    <div className='flex-1 p-4'>
                        {/* Một khối div giả lập tiêu đề hoặc nội dung với chiều cao và màu sắc giả lập */}
                        <div className='h-4 bg-zinc-700 rounded w-3/4 mb-2' />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Xuất component để có thể sử dụng ở các file khác
export default FeaturedGridSkeleton;
