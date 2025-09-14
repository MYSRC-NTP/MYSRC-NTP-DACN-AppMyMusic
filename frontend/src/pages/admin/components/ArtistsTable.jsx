import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const EditArtistDialog = ({ artist, open, onOpenChange, onUpdated }) => {
  const [name, setName] = useState(artist?.name || "");
  const [bio, setBio] = useState(artist?.bio || "");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(artist?.name || "");
    setBio(artist?.bio || "");
    setImageFile(null);
  }, [artist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (imageFile) formData.append("imageFile", imageFile);
      const res = await fetch(`/api/artists/${artist.id}`, {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        onUpdated();
        onOpenChange(false);
      } else {
        alert("Cập nhật nghệ sĩ thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa nghệ sĩ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 mt-2 block">Tên nghệ sĩ</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 mt-2 block">Mô tả</label>
            <Input value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 mt-2 block">
              Ảnh đại diện mới (nếu muốn đổi)
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {artist.imageUrl && !imageFile && (
              <img
                src={artist.imageUrl}
                alt="preview"
                style={{ width: 100, marginTop: 8 }}
              />
            )}
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                style={{ width: 100, marginTop: 8 }}
              />
            )}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ArtistsTable = ({ onArtistChanged }) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editArtist, setEditArtist] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const fetchArtists = async () => {
    setLoading(true);
    const res = await fetch("/api/artists");
    const data = await res.json();
    setArtists(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchArtists();
  }, []);
  useEffect(() => {
    if (onArtistChanged) fetchArtists();
  }, [onArtistChanged]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nghệ sĩ này?")) return;
    await fetch(`/api/artists/${id}`, { method: "DELETE" });
    fetchArtists();
  };

  const handleEdit = (artist) => {
    setEditArtist(artist);
    setEditOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-zinc-800">
            <th className="p-2">Ảnh</th>
            <th className="p-2">Tên nghệ sĩ</th>
            <th className="p-2">Mô tả</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Đang tải...
              </td>
            </tr>
          ) : artists.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Chưa có nghệ sĩ nào
              </td>
            </tr>
          ) : (
            artists.map((artist) => (
              <tr key={artist.id} className="border-b border-zinc-800">
                <td className="p-2">
                  {artist.imageUrl ? (
                    <img
                      src={artist.imageUrl}
                      alt="avatar"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center text-xs text-zinc-300">
                      No image
                    </div>
                  )}
                </td>
                <td className="p-2 font-medium">{artist.name}</td>
                <td className="p-2 max-w-xs truncate">{artist.bio}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="text-blue-500 hover:underline px-2 py-1 font-medium"
                    onClick={() => handleEdit(artist)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-500 hover:underline px-2 py-1 font-medium"
                    onClick={() => handleDelete(artist.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {editArtist && (
        <EditArtistDialog
          artist={editArtist}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUpdated={fetchArtists}
        />
      )}
    </div>
  );
};

export default ArtistsTable;
