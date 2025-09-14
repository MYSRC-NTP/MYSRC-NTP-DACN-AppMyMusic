import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { Plus } from "lucide-react";

const AddToPlaylistDialog = ({ songId, trigger = null, afterAdd }) => {
  const {
    playlists,
    addSongToPlaylist,
    createPlaylist,
    fetchPlaylists,
    isLoading,
  } = usePlaylistStore();
  const [open, setOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAdd = async (playlistId) => {
    setError("");
    const result = await addSongToPlaylist(playlistId, songId);
    if (result?.status === "success" || result === undefined) {
      setMessage("Đã thêm vào playlist!");
      setTimeout(() => {
        setOpen(false);
        setMessage("");
        if (afterAdd) afterAdd();
      }, 1000);
    } else if (result?.status === "exists") {
      setError("Bài hát đã có trong playlist!");
    } else {
      setError("Có lỗi xảy ra!");
    }
  };

  const handleCreateAndAdd = async () => {
    setError("");
    if (!newPlaylistName.trim()) {
      setError("Tên playlist không được để trống");
      return;
    }
    if (playlists.some((pl) => pl.name === newPlaylistName.trim())) {
      setError("Tên playlist đã tồn tại");
      return;
    }
    if (playlists.length >= 5) {
      setError("Bạn chỉ được tạo tối đa 5 playlist");
      return;
    }
    await createPlaylist(newPlaylistName.trim());
    await fetchPlaylists();
    // Lấy playlists mới nhất từ store
    const updatedPlaylists = [...usePlaylistStore.getState().playlists];
    const newPl = updatedPlaylists.find(
      (pl) => pl.name === newPlaylistName.trim()
    );
    setNewPlaylistName("");
    if (newPl) {
      await handleAdd(newPl.id);
    } else {
      setError("Tạo playlist thất bại!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="icon" variant="ghost">
            <Plus className="w-4 h-4 text-green-600" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Thêm vào playlist</DialogTitle>
        {playlists.length === 0 ? (
          <>
            <DialogDescription>
              Bạn chưa có playlist nào. Tạo playlist mới để thêm bài hát này.
            </DialogDescription>
            <Input
              placeholder="Tên playlist"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              maxLength={50}
              disabled={isLoading}
            />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <DialogFooter>
              <Button onClick={handleCreateAndAdd} disabled={isLoading}>
                Tạo & Thêm
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogDescription>
              Chọn playlist để thêm bài hát này:
            </DialogDescription>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlists.map((pl) => (
                <Button
                  key={pl.id}
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleAdd(pl.id)}
                  disabled={isLoading}
                >
                  {pl.name}{" "}
                  <span className="ml-2 text-xs text-zinc-400">
                    ({pl.songs.length} bài hát)
                  </span>
                </Button>
              ))}
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="text-sm text-zinc-400 mb-2">
                Hoặc tạo playlist mới:
              </div>
              <Input
                placeholder="Tên playlist"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                maxLength={50}
                disabled={isLoading}
              />
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
              <DialogFooter>
                <Button onClick={handleCreateAndAdd} disabled={isLoading}>
                  Tạo & Thêm
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Hủy</Button>
                </DialogClose>
              </DialogFooter>
            </div>
            {message && (
              <div className="text-green-500 text-sm mt-2">{message}</div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistDialog;
