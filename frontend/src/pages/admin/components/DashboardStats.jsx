import { useMusicStore } from "@/stores/useMusicStore"; // Nhập hook để lấy dữ liệu thống kê từ store
import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react"; // Nhập các biểu tượng từ thư viện lucide-react
import StatsCard from "./StatsCard"; // Nhập component StatsCard dùng để hiển thị các thống kê

const DashboardStats = () => {
    // Lấy dữ liệu thống kê từ hook useMusicStore
    const { stats } = useMusicStore();

    // Dữ liệu thống kê cần hiển thị, bao gồm: tổng số bài hát, album, nghệ sĩ và người dùng
    const statsData = [
        {
            icon: ListMusic, // Biểu tượng bài hát
            label: "Total Songs", // Nhãn cho thống kê bài hát
            value: stats.totalSongs.toString(), // Giá trị thống kê tổng số bài hát
            bgColor: "bg-emerald-500/10", // Màu nền cho thống kê bài hát
            iconColor: "text-emerald-500", // Màu biểu tượng bài hát
        },
        {
            icon: Library, // Biểu tượng thư viện (album)
            label: "Total Albums", // Nhãn cho thống kê album
            value: stats.totalAlbums.toString(), // Giá trị thống kê tổng số album
            bgColor: "bg-violet-500/10", // Màu nền cho thống kê album
            iconColor: "text-violet-500", // Màu biểu tượng album
        },
        {
            icon: Users2, // Biểu tượng nghệ sĩ
            label: "Total Artists", // Nhãn cho thống kê nghệ sĩ
            value: stats.totalArtists.toString(), // Giá trị thống kê tổng số nghệ sĩ
            bgColor: "bg-orange-500/10", // Màu nền cho thống kê nghệ sĩ
            iconColor: "text-orange-500", // Màu biểu tượng nghệ sĩ
        },
        {
            icon: PlayCircle, // Biểu tượng người dùng
            label: "Total Users", // Nhãn cho thống kê người dùng
            value: stats.totalUsers.toLocaleString(), // Giá trị thống kê tổng số người dùng (định dạng số với dấu phân cách hàng nghìn)
            bgColor: "bg-sky-500/10", // Màu nền cho thống kê người dùng
            iconColor: "text-sky-500", // Màu biểu tượng người dùng
        },
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
            {/* Duyệt qua danh sách thống kê và hiển thị mỗi thống kê dưới dạng một StatsCard */}
            {statsData.map((stat) => (
                <StatsCard
                    key={stat.label} // Chỉ định key duy nhất cho mỗi phần tử trong danh sách
                    icon={stat.icon} // Truyền biểu tượng
                    label={stat.label} // Truyền nhãn
                    value={stat.value} // Truyền giá trị thống kê
                    bgColor={stat.bgColor} // Truyền màu nền cho thống kê
                    iconColor={stat.iconColor} // Truyền màu biểu tượng
                />
            ))}
        </div>
    );
};

export default DashboardStats;
