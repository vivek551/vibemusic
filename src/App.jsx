import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import ArtistList from "./components/ArtistList";
import SearchResults from "./components/SearchResults";
import NowPlaying from "./components/NowPlaying";
import MiniPlayer from "./components/MiniPlayer";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  // On search submit
  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://vibemusicapi-eight.vercel.app/api/search/songs?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      const results = data.data?.results || [];
      setSongs(results);
      setSearched(true);

      // Collect artists from songs
      const uniqueArtists = Array.from(
        new Map(
          results.flatMap(s => s.artists?.primary || []).map(a => [a.id, a])
        ).values()
      );
      setArtists(uniqueArtists);

      toast.success(`Found ${results.length} song(s)!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch songs!");
    }
    setLoading(false);
  };

  // Play a song by index
  const playSongByIndex = (index) => {
    if (index < 0 || index >= songs.length) {
      toast.error("No more songs.");
      return;
    }
    const song = songs[index];
    if (!song || !song.downloadUrl) {
      toast.error("Invalid song data!");
      return;
    }
    const audioSrc = song.downloadUrl.find(url => url?.quality === "160kbps")?.url;
    if (!audioSrc) {
      toast.error("No audio available for this song");
      return;
    }
    // Set current song index and playing state
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setShowNowPlaying(true);

    // Update song's audioSrc to state for player
    setSongs(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], audioSrc };
      return copy;
    });
  };

  // Handlers for controls
  const togglePlayPause = () => {
    if (currentSongIndex === null) return;
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (currentSongIndex === null) return;
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= songs.length) nextIndex = 0; // loop
    playSongByIndex(nextIndex);
  };

  const playPrev = () => {
    if (currentSongIndex === null) return;
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) prevIndex = songs.length - 1; // loop
    playSongByIndex(prevIndex);
  };

  // Current song object
  const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: { background: "#1db954", color: "black", fontWeight: "bold" },
        }}
      />
      <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-6 flex flex-col items-center text-white font-sans">
        <h1 className="text-4xl font-extrabold mb-8 tracking-tight drop-shadow-lg">
          Vibe Music Player
        </h1>

        {/* Search Bar */}
        <div className="flex max-w-md w-full mb-8 gap-2">
          <input
            type="text"
            placeholder="Search songs, artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-grow rounded-lg px-4 py-2 bg-gray-800 text-white font-semibold placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-gray-700 transition"
            aria-label="Search songs or artists"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-green-500 text-black font-semibold rounded-lg px-6 py-2 shadow-lg hover:bg-green-400
              transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Popular Artists */}
        <ArtistList artists={artists} />

        {/* Search Results */}
        <SearchResults songs={songs} loading={loading} query={query} playSong={(song) => {
          const index = songs.findIndex(s => s.id === song.id);
          if (index !== -1) playSongByIndex(index);
        }} />

        {/* Now Playing Views */}
        {/* Show NowPlaying full screen if open */}
{showNowPlaying && currentSong && (
  <NowPlaying
    song={currentSong}
    isPlaying={isPlaying}
    onPlayPause={togglePlayPause}
    onNext={playNext}
    onPrev={playPrev}
    onClose={() => setShowNowPlaying(false)}
  />
)}

{/* Show MiniPlayer only if song is playing and NowPlaying is closed */}
{!showNowPlaying && currentSong && (
  <MiniPlayer
    song={currentSong}
    isPlaying={isPlaying}
    onPlayPause={togglePlayPause}
    onNext={playNext}
    onPrev={playPrev}
    onExpand={() => setShowNowPlaying(true)}
  />
)}

      </main>
    </>
  );
}
