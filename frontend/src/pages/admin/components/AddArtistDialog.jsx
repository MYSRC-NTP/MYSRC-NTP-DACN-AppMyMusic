import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddArtistDialog = ({ onArtistAdded }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (imageFile) formData.append("imageFile", imageFile);

      const res = await fetch("/api/artists", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setName("");
        setBio("");
        setImageFile(null);
        setOpen(false);
        if (onArtistAdded) onArtistAdded();
      } else {
        alert("Thêm nghệ sĩ thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Thêm nghệ sĩ</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm nghệ sĩ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 mt-2 block">Tên nghệ sĩ</label>
            <Input
              placeholder="Tên nghệ sĩ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 mt-2 block">Mô tả</label>
            <Input
              placeholder="Mô tả"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 mt-2 block">Ảnh đại diện</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              required
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                style={{ width: 100, marginTop: 8 }}
              />
            )}
          </div>
          <Button type="submit" disabled={loading} className="mt-4">
            {loading ? "Đang thêm..." : "Thêm nghệ sĩ"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddArtistDialog;
