// Định nghĩa một component có tên 'PlaylistSkeleton'
const PlaylistSkeleton = () => {
    // Tạo một mảng có 7 phần tử và map qua từng phần tử để tạo giao diện loading giả lập (skeleton)
    return Array.from({ length: 7 }).map((_, i) => (
        // Mỗi phần tử được đại diện bằng một div với key là chỉ số i
        <div key={i} className='p-2 rounded-md flex items-center gap-3'>
            {/* Khối vuông đại diện cho hình ảnh hoặc biểu tượng, với kích thước cố định */}
            <div className='w-12 h-12 bg-zinc-800 rounded-md flex-shrink-0 animate-pulse' />
            {/* Phần thông tin nằm bên cạnh khối vuông, được ẩn trên màn hình nhỏ (hidden md:block) */}
            <div className='flex-1 min-w-0 hidden md:block space-y-2'>
                {/* Dòng lớn giả lập tiêu đề hoặc nội dung chính */}
                <div className='h-4 bg-zinc-800 rounded animate-pulse w-3/4' />
                {/* Dòng nhỏ hơn giả lập mô tả hoặc thông tin phụ */}
                <div className='h-3 bg-zinc-800 rounded animate-pulse w-1/2' />
            </div>
        </div>
    ));
};

// Xuất component để có thể sử dụng ở các file khác
export default PlaylistSkeleton;
