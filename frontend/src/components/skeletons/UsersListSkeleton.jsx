// Định nghĩa một component có tên 'UsersListSkeleton'
const UsersListSkeleton = () => {
    // Tạo một mảng gồm 4 phần tử và map qua từng phần tử để tạo giao diện loading giả lập (skeleton)
    return Array.from({ length: 4 }).map((_, i) => (
        // Mỗi phần tử được đại diện bởi một div với key là chỉ số i
        <div 
            key={i} 
            className='flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg animate-pulse'>
            {/* Hình tròn đại diện cho ảnh đại diện của người dùng */}
            <div className='h-12 w-12 rounded-full bg-zinc-800' />
            {/* Phần thông tin chi tiết người dùng, ẩn trên màn hình nhỏ và chỉ hiển thị trên màn hình lớn */}
            <div className='flex-1 lg:block hidden'>
                {/* Thanh giả lập tiêu đề hoặc tên người dùng */}
                <div className='h-4 w-24 bg-zinc-800 rounded mb-2' />
                {/* Thanh giả lập thông tin phụ hoặc trạng thái */}
                <div className='h-3 w-32 bg-zinc-800 rounded' />
            </div>
        </div>
    ));
};

// Xuất component để có thể sử dụng ở các file khác
export default UsersListSkeleton;
