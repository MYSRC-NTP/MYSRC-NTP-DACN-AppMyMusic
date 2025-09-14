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

const SongsTable = () => {
  const { songs, deleteSong, fetchSongs, albums } = useMusicStore();
  const [editingSong, setEditingSong] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    artistId: "",
    albumId: "",
    duration: "",
  });
  const [editImage, setEditImage] = useState(null);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    fetch("/api/artists")
      .then((res) => res.json())
      .then(setArtists);
  }, []);

  const handleEdit = (song) => {
    setEditingSong(song);
    setEditData({
      title: song.title,
      artistId: song.artistId || "",
      albumId: song.albumId || "",
      duration: song.duration,
    });
    setEditImage(null);
    setIsEditOpen(true);
  };

  const handleEditFileChange = (e) => {
    setEditImage(e.target.files[0]);
  };

  const handleEditSubmit = async () => {
    if (!editingSong) return;
    try {
      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("artistId", editData.artistId);
      formData.append("albumId", editData.albumId);
      formData.append("duration", editData.duration);
      if (editImage) formData.append("imageFile", editImage);

      await axiosInstance.put(`/admin/songs/${editingSong.id}`, formData);
      setIsEditOpen(false);
      setEditingSong(null);
      setEditData({
        title: "",
        artistId: "",
        albumId: "",
        duration: "",
      });
      setEditImage(null);
      fetchSongs();
    } catch (err) {
      console.error("Lỗi khi cập nhật bài hát:", err);
      alert("Lỗi khi cập nhật bài hát!");
    }
  };

  // Reset state khi đóng dialog
  const handleDialogChange = (open) => {
    setIsEditOpen(open);
    if (!open) {
      setEditingSong(null);
      setEditData({
        title: "",
        artistId: "",
        albumId: "",
        duration: "",
      });
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
          {songs.map((song) => (
            <TableRow key={song.id}>
              <TableCell className="text-center">
                {song.imageUrl && (
                  <img
                    src={song.imageUrl}
                    alt={song.title}
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
              <TableCell className="text-center">{song.title}</TableCell>
              <TableCell className="text-center">{song.artist}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300 mr-2"
                  onClick={() => handleEdit(song)}
                >
                  Sửa
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSong(song.id)}
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
          <DialogTitle>Cập nhật bài hát</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin bài hát và lưu lại.
          </DialogDescription>
          <label className="mb-1 mt-2 block">Tên bài hát</label>
          <Input
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
          />
          <label className="mb-1 mt-2 block">Nghệ sĩ</label>
          <select
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
            value={editData.artistId || ""}
            onChange={(e) =>
              setEditData({ ...editData, artistId: e.target.value })
            }
          >
            <option value="">Chọn nghệ sĩ</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
          <label className="mb-1 mt-2 block">Album</label>
          <select
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
            value={editData.albumId || ""}
            onChange={(e) =>
              setEditData({ ...editData, albumId: e.target.value })
            }
          >
            <option value="">Chọn album</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title}
              </option>
            ))}
          </select>
          <label className="mb-1 mt-2 block">Hình ảnh</label>
          <Input type="file" accept="image/*" onChange={handleEditFileChange} />
          {editingSong?.imageUrl && !editImage && (
            <img
              src={editingSong.imageUrl}
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

export default SongsTable;
