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

const AddSongDialog = () => {
  const { albums, fetchSongs } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newSong, setNewSong] = useState({
    title: "",
    artistId: "",
    album: "",
    duration: "0",
  });

  const [files, setFiles] = useState({
    audio: null,
    image: null,
  });

  const [artists, setArtists] = useState([]);
  useEffect(() => {
    fetch("/api/artists")
      .then((res) => res.json())
      .then(setArtists);
  }, []);

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: fileList[0],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newSong.title);
      formData.append("artistId", newSong.artistId);
      formData.append("albumId", newSong.album);
      formData.append("duration", newSong.duration);
      if (files.image) formData.append("imageFile", files.image);
      if (files.audio) formData.append("audioFile", files.audio);

      await axiosInstance.post("/admin/songs", formData);

      setSongDialogOpen(false);
      fetchSongs();
    } catch (err) {
      alert("Lỗi khi thêm bài hát!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Thêm bài hát</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Thêm bài hát</DialogTitle>
        <DialogDescription>
          Điền thông tin và tải lên file âm thanh, hình ảnh để thêm bài hát mới
          vào hệ thống.
        </DialogDescription>

        <label className="mb-1 mt-2 block">Tên bài hát</label>
        <Input
          placeholder="Tên bài hát"
          value={newSong.title}
          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
        />

        <label className="mb-1 mt-2 block">Nghệ sĩ</label>
        <Select
          value={newSong.artistId}
          onValueChange={(value) => setNewSong({ ...newSong, artistId: value })}
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

        <label className="mb-1 mt-2 block">Album</label>
        <Select
          value={newSong.album}
          onValueChange={(value) => setNewSong({ ...newSong, album: value })}
        >
          <SelectTrigger>Chọn album</SelectTrigger>
          <SelectContent>
            {albums.map((album) => (
              <SelectItem key={album.id} value={album.id}>
                {album.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="mb-1 mt-2 block">Hình ảnh</label>
        <Input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        {files.image && (
          <img
            src={URL.createObjectURL(files.image)}
            alt="preview"
            style={{ width: 100, marginTop: 8 }}
          />
        )}

        <label className="mb-1 mt-2 block">File âm thanh</label>
        <Input
          type="file"
          name="audio"
          accept="audio/*"
          onChange={handleFileChange}
        />

        <Button onClick={handleSubmit} disabled={isLoading} className="mt-4">
          {isLoading ? "Đang thêm..." : "Thêm bài hát"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongDialog;
