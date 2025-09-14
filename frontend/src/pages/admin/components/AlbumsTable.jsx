import { useEffect, useState } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const AlbumsTable = () => {
  const { albums, deleteAlbum, fetchAlbums } = useMusicStore();
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    artistId: "",
  });
  const [editImage, setEditImage] = useState(null);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await axiosInstance.get("/artists");
        setArtists(res.data);
      } catch (_) {}
    };
    fetchArtists();
  }, []);

  const handleEdit = (album) => {
    setEditingAlbum(album);
    setEditData({
      title: album.title,
      artistId: album.artistId || "",
    });
    setEditImage(null);
    setIsEditOpen(true);
  };

  const handleEditFileChange = (e) => {
    setEditImage(e.target.files[0]);
  };

  const handleEditSubmit = async () => {
    if (!editingAlbum) return;
    try {
      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("artistId", editData.artistId);
      if (editImage) formData.append("imageFile", editImage);

      await axiosInstance.put(`/admin/albums/${editingAlbum.id}`, formData);
      setIsEditOpen(false);
      setEditingAlbum(null);
      setEditData({ title: "", artist: "" });
      setEditImage(null);
      fetchAlbums();
    } catch (err) {
      alert("Lỗi khi cập nhật album!");
    }
  };

  const handleDialogChange = (open) => {
    setIsEditOpen(open);
    if (!open) {
      setEditingAlbum(null);
      setEditData({ title: "", artist: "" });
      setEditImage(null);
    }
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th className="text-center">Ảnh</th>
            <th className="text-center">Tiêu đề</th>
            <th className="text-center">Nghệ sĩ</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => (
            <TableRow key={album.id}>
              <TableCell className="text-center">
                {album.imageUrl && (
                  <img
                    src={album.imageUrl}
                    alt={album.title}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 8,
                      margin: "0 auto",
                    }}
                  />
                )}
              </TableCell>
              <TableCell className="text-center">{album.title}</TableCell>
              <TableCell className="text-center">{album.artist}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300 mr-2"
                  onClick={() => handleEdit(album)}
                >
                  Sửa
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAlbum(album.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <Dialog open={isEditOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogTitle>Cập nhật album</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin album và lưu lại.
          </DialogDescription>
          <label className="mb-1 mt-2 block">Tên album</label>
          <Input
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
          />
          <label className="mb-1 mt-2 block">Nghệ sĩ</label>
          <Select
            value={editData.artistId}
            onValueChange={(value) =>
              setEditData({ ...editData, artistId: value })
            }
          >
            <SelectTrigger>Chọn nghệ sĩ</SelectTrigger>
            <SelectContent>
              {artists.map((artist) => (
                <SelectItem key={artist.id} value={artist.id}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="mb-1 mt-2 block">Hình ảnh</label>
          <Input type="file" accept="image/*" onChange={handleEditFileChange} />
          {editingAlbum?.imageUrl && !editImage && (
            <img
              src={editingAlbum.imageUrl}
              alt="preview"
              style={{ width: 100, marginTop: 8 }}
            />
          )}
          {editImage && (
            <img
              src={URL.createObjectURL(editImage)}
              alt="preview"
              style={{ width: 100, marginTop: 8 }}
            />
          )}
          <Button onClick={handleEditSubmit} className="mt-4">
            Lưu thay đổi
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AlbumsTable;
