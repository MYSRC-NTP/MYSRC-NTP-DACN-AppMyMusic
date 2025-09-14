import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Nhập các thành phần UI Card từ thư viện
import { Music } from "lucide-react"; // Nhập biểu tượng Music từ thư viện lucide-react
import SongsTable from "./SongsTable"; // Nhập component SongsTable để hiển thị danh sách bài hát
import AddSongDialog from "./AddSongDialog"; // Nhập component AddSongDialog để thêm bài hát mới

const SongsTabContent = () => {
    return (
        <Card> {/* Card bao quanh phần nội dung */}
            <CardHeader> {/* Tiêu đề của card */}
                <div className='flex items-center justify-between'> {/* Flexbox để căn chỉnh tiêu đề và nút thêm bài hát */}
                    <div>
                        <CardTitle className='flex items-center gap-2'> {/* Tiêu đề chính của phần "Songs Library" */}
                            <Music className='size-5 text-emerald-500' /> {/* Biểu tượng âm nhạc từ lucide-react */}
                            Songs Library {/* Tiêu đề hiển thị */}
                        </CardTitle>
                        <CardDescription>Manage your music tracks</CardDescription> {/* Mô tả phần này là "Quản lý bài hát của bạn" */}
                    </div>
                    <AddSongDialog /> {/* Nút để mở dialog thêm bài hát mới */}
                </div>
            </CardHeader>
            <CardContent> {/* Nội dung của Card, bao gồm bảng bài hát */}
                <SongsTable /> {/* Hiển thị bảng danh sách các bài hát */}
            </CardContent>
        </Card>
    );
};

export default SongsTabContent;
