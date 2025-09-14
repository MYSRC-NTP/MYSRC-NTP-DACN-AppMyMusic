import { Card, CardContent } from "@/components/ui/card"; // Nhập các thành phần Card từ thư viện UI để tạo card hiển thị thống kê

// Component StatsCard dùng để hiển thị một thẻ thống kê với biểu tượng, nhãn và giá trị
const StatsCard = ({ bgColor, icon: Icon, iconColor, label, value }) => {
    return (
        // Card chứa nội dung thống kê
        <Card className='bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800/80 transition-colors'>
            <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                    {/* Khối chứa biểu tượng, với màu nền theo props bgColor */}
                    <div className={`p-3 rounded-lg ${bgColor}`}>
                        {/* Biểu tượng được truyền vào dưới dạng component Icon */}
                        <Icon className={`size-6 ${iconColor}`} />
                    </div>
                    {/* Khối chứa nhãn và giá trị */}
                    <div>
                        {/* Nhãn mô tả cho thẻ thống kê */}
                        <p className='text-sm text-zinc-400'>{label}</p>
                        {/* Giá trị thống kê, với kiểu chữ lớn và đậm */}
                        <p className='text-2xl font-bold'>{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatsCard;
