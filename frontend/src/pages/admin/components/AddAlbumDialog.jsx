import { useState, useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";

const AddAlbumDialog = () => {
  const { fetchAlbums } = useMusicStore();
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artistId: "",
    releaseYear: "",
  });

  const [image, setImage] = useState(null);
  const [artists, setArtists] = useState([]);
  useEffect(() => {
    fetch("/api/artists")
      .then((res) => res.json())
      .then(setArtists);
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artistId", newAlbum.artistId);
      formData.append("releaseYear", newAlbum.releaseYear);
      if (image) formData.append("imageFile", image);

      await axiosInstance.post("/admin/albums", formData);

      setAlbumDialogOpen(false);
      setNewAlbum({ title: "", artistId: "", releaseYear: "" });
      setImage(null);
      fetchAlbums();
    } catch (err) {
      alert("Lỗi khi thêm album!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Thêm album</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Thêm album</DialogTitle>
        <DialogDescription>
          Điền thông tin và tải lên hình ảnh để thêm album mới vào hệ thống.
        </DialogDescription>

        <label className="mb-1 mt-2 block">Tên album</label>
        <Input
          placeholder="Tên album"
          value={newAlbum.title}
          onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
        />

        <label className="mb-1 mt-2 block">Nghệ sĩ</label>
        <Select
          value={newAlbum.artistId}
          onValueChange={(value) =>
            setNewAlbum({ ...newAlbum, artistId: value })
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

        <label className="mb-1 mt-2 block">Năm phát hành</label>
        <Input
          placeholder="Năm phát hành"
          type="number"
          value={newAlbum.releaseYear}
          onChange={(e) =>
            setNewAlbum({ ...newAlbum, releaseYear: e.target.value })
          }
        />

        <label className="mb-1 mt-2 block">Hình ảnh</label>
        <Input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            style={{ width: 100, marginTop: 8 }}
          />
        )}

        <Button onClick={handleSubmit} disabled={isLoading} className="mt-4">
          {isLoading ? "Đang thêm..." : "Thêm album"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlbumDialog;
