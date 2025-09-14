import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Play } from "lucide-react";

const ArtistProfilePage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/artists/${id}`);
        setArtist(res.data);
        setAlbums(res.data.albums || []);
        setSongs(res.data.songs || []);
      } catch (err) {
        setArtist(null);
        setAlbums([]);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading artist...</div>;
  if (!artist) return <div>Artist not found.</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="w-32 h-32 object-cover rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold text-white">{artist.name}</h1>
          <p className="text-zinc-400 mt-2">{artist.bio}</p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2">Albums</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {albums.map((album) => (
          <Link
            key={album.id}
            to={`/albums/${album.id}`}
            className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700"
          >
            <img
              src={album.imageUrl}
              alt={album.title}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <div className="text-white font-semibold text-lg">
              {album.title}
            </div>
          </Link>
        ))}
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2">Songs</h2>
      <div className="bg-black/20 backdrop-blur-sm rounded-lg">
        <div className="grid grid-cols-[16px_4fr_2fr_1fr_60px] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
          <div>#</div>
          <div>Title</div>
          <div>Released Date</div>
          <div></div>
        </div>
        <div className="px-6">
          <div className="space-y-2 py-4">
            {songs.length === 0 ? (
              <div className="text-center text-zinc-400 py-10">
                No songs found for this artist.
              </div>
            ) : (
              songs.map((song, index) => {
                const isCurrent = currentSong?.id === song.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => playAlbum(songs, index)}
                    className={`grid grid-cols-[16px_4fr_2fr_1fr_60px] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group items-center cursor-pointer ${
                      isCurrent ? "bg-emerald-900/30" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {isCurrent && isPlaying ? (
                        <div className="size-4 text-green-500">♫</div>
                      ) : (
                        <span className="group-hover:hidden">{index + 1}</span>
                      )}
                      {!isCurrent && (
                        <Play className="h-4 w-4 hidden group-hover:block" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="size-10 rounded"
                      />
                      <div>
                        <div className="font-medium text-white">
                          {song.title}
                        </div>
                        <div>{song.artist}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {song.createdAt ? song.createdAt.split("T")[0] : "--"}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfilePage;
