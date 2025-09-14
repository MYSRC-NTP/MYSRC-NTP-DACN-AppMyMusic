import { useState, useEffect } from "react";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useAuth } from "@clerk/clerk-react";
import { Plus } from "lucide-react";
import AddToPlaylistDialog from "@/components/AddToPlaylistDialog";

const DEFAULT_PLAYLIST_NAME = "Yêu thích";

const SectionGrid = ({ songs, title, isLoading, allowExpand = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  // Nếu allowExpand, cho phép mở rộng, còn không thì chỉ 6 bài
  const displayedSongs = allowExpand
    ? expanded
      ? songs
      : songs.slice(0, 6)
    : songs.slice(0, 6);
  const showButton = songs.length > visibleCount;

  const { playlists, addSongToPlaylist, fetchPlaylists, createPlaylist } =
    usePlaylistStore();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchPlaylists();
  }, [isLoaded, isSignedIn, fetchPlaylists]);

  const defaultPlaylist = playlists.find(
    (pl) => pl.name === DEFAULT_PLAYLIST_NAME
  );

  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        {allowExpand && songs.length > 6 && (
          <Button
            variant="link"
            className="text-sm text-zinc-400 hover:text-white"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Rút gọn" : "Xem thêm"}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {displayedSongs.map((song) => (
          <div
            key={song._id || song.id}
            className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer relative"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <PlayButton song={song} />
              {/* Nút add vào playlist: để lại như cũ, icon Plus ở góc */}
              <AddToPlaylistDialog
                songId={song.id}
                trigger={
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-green-500 transition"
                  >
                    <Plus className="w-4 h-4 text-green-600" />
                  </Button>
                }
              />
            </div>
            <h3 className="font-medium mb-2 truncate">{song.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;
