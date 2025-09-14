import { Card } from "@/components/ui/card";
import { usePlayerStore } from "@/stores/usePlayerStore";

const SearchResults = ({ results, isLoading, onSongSelect }) => {
  const { setCurrentSong } = usePlayerStore();

  const handlePlay = (song) => {
    setCurrentSong(song);
    if (onSongSelect) onSongSelect(song);
  };

  if (isLoading) {
    return (
      <div className="absolute left-0 right-0 mt-2 z-50 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg p-3 text-sm text-zinc-300">
        Đang tìm kiếm...
      </div>
    );
  }
  if (!results?.length) return null;

  return (
    <div className="absolute left-0 right-0 mt-2 z-50 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg max-h-80 overflow-y-auto p-2 space-y-2">
      {results.map((song) => (
        <Card
          key={song.id}
          className="flex items-center space-x-4 p-2 hover:bg-zinc-800/50 cursor-pointer transition-colors group"
          onClick={() => handlePlay(song)}
        >
          <div className="flex-1">
            <div className="font-medium">{song.title}</div>
            <div className="text-xs text-zinc-400">{song.artist}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
