import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play, Shuffle, Repeat } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { formatDuration } from "@/lib/timeUtils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const DEFAULT_PLAYLIST_NAME = "Yêu thích";
const DEFAULT_IMAGE = "/img/yeuthich.png"; // Đổi thành ảnh bạn muốn

const PlaylistPage = () => {
  const {
    playlists,
    fetchPlaylists,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    removeSongFromPlaylist,
  } = usePlaylistStore();
  const {
    currentSong,
    isPlaying,
    playAlbum,
    togglePlay,
    toggleShuffle,
    toggleRepeat,
    isShuffling,
    repeatMode,
    setCurrentSong,
  } = usePlayerStore();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [editPlaylistName, setEditPlaylistName] = useState("");
  const [editPlaylistId, setEditPlaylistId] = useState(null);
  const [error, setError] = useState("");

  const { isLoaded, isSignedIn } = useAuth();
  useEffect(() => {
    if (isLoaded && isSignedIn) fetchPlaylists();
  }, [isLoaded, isSignedIn, fetchPlaylists]);

  const handleCreatePlaylist = async () => {
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
    setNewPlaylistName("");
    setCreateDialogOpen(false);
  };

  const handleEditPlaylist = async () => {
    setError("");
    if (!editPlaylistName.trim()) {
      setError("Tên playlist không được để trống");
      return;
    }
    if (
      playlists.some(
        (pl) => pl.name === editPlaylistName.trim() && pl.id !== editPlaylistId
      )
    ) {
      setError("Tên playlist đã tồn tại");
      return;
    }
    await updatePlaylist(editPlaylistId, editPlaylistName.trim());
    setEditDialogOpen(false);
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm("Bạn có chắc muốn xóa playlist này?")) {
      await deletePlaylist(playlistId);
      if (selectedPlaylistId === playlistId) setSelectedPlaylistId(null);
    }
  };

  // Hiển thị danh sách playlist
  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Playlist của bạn</h1>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          disabled={playlists.length >= 5}
        >
          + Tạo playlist
        </Button>
      </div>
      {playlists.length === 0 ? (
        <div className="text-center text-zinc-400 py-10">
          Bạn chưa có playlist nào. Hãy tạo playlist mới!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              className={`bg-zinc-800 rounded-lg p-4 shadow cursor-pointer hover:bg-zinc-700 transition relative ${
                selectedPlaylistId === pl.id ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => setSelectedPlaylistId(pl.id)}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">{pl.name}</h2>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditPlaylistId(pl.id);
                      setEditPlaylistName(pl.name);
                      setEditDialogOpen(true);
                    }}
                  >
                    Đổi tên
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlaylist(pl.id);
                    }}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-zinc-400">
                {pl.songs.length} bài hát
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog tạo playlist */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogTitle>Tạo playlist mới</DialogTitle>
          <DialogDescription>
            Nhập tên playlist (tối đa 5, không trùng tên).
          </DialogDescription>
          <Input
            placeholder="Tên playlist"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            maxLength={50}
          />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <DialogFooter>
            <Button onClick={handleCreatePlaylist}>Tạo</Button>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog đổi tên playlist */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogTitle>Đổi tên playlist</DialogTitle>
          <DialogDescription>Nhập tên mới cho playlist.</DialogDescription>
          <Input
            placeholder="Tên playlist mới"
            value={editPlaylistName}
            onChange={(e) => setEditPlaylistName(e.target.value)}
            maxLength={50}
          />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <DialogFooter>
            <Button onClick={handleEditPlaylist}>Lưu</Button>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hiển thị bài hát trong playlist đã chọn */}
      {selectedPlaylistId && (
        <div className="mt-10">
          <PlaylistSongsView
            playlist={playlists.find((pl) => pl.id === selectedPlaylistId)}
            removeSongFromPlaylist={removeSongFromPlaylist}
          />
        </div>
      )}
    </div>
  );
};

// Component hiển thị danh sách bài hát trong playlist
const PlaylistSongsView = ({ playlist, removeSongFromPlaylist }) => {
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  if (!playlist) return null;
  const handlePlayPlaylist = () => {
    if (!playlist?.songs?.length) return;
    const isCurrentPlaylistPlaying = playlist.songs.some(
      (item) => item.song.id === currentSong?.id
    );
    if (isCurrentPlaylistPlaying) togglePlay();
    else
      playAlbum(
        playlist.songs.map((item) => item.song),
        0
      );
  };
  const handlePlaySong = (index) => {
    if (!playlist?.songs?.length) return;
    playAlbum(
      playlist.songs.map((item) => item.song),
      index
    );
  };
  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{playlist.name}</h2>
        <Button
          onClick={handlePlayPlaylist}
          disabled={playlist.songs.length === 0}
        >
          Phát tất cả
        </Button>
      </div>
      {playlist.songs.length === 0 ? (
        <div className="text-center text-zinc-400 py-10">
          Playlist chưa có bài hát nào.
        </div>
      ) : (
        <div className="space-y-2">
          {playlist.songs.map((item, index) => {
            const song = item.song;
            const isCurrent = currentSong?.id === song.id;
            return (
              <div
                key={song.id}
                onClick={() => handlePlaySong(index)}
                className={`flex items-center gap-4 p-2 rounded hover:bg-zinc-800 cursor-pointer ${
                  isCurrent ? "bg-emerald-900/30" : ""
                }`}
              >
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-12 h-12 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium text-white">{song.title}</div>
                  <div className="text-zinc-400 text-sm">{song.artist}</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSongFromPlaylist(playlist.id, song.id);
                  }}
                >
                  Xóa
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
