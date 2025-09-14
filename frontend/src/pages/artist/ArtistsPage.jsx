import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await axiosInstance.get("/artists");
        setArtists(res.data);
      } catch (err) {
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  if (loading) return <div>Loading artists...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Artists</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            to={`/artists/${artist.id}`}
            className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700"
          >
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <div className="text-white font-semibold text-lg">
              {artist.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtistsPage;
