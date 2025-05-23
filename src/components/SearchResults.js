import React from "react";
import SongCard from "./SongCard";

const SearchResults = ({ songs, loading, query, playSong }) => {
  return (
    <section className="w-full max-w-6xl mb-12">
      <h2 className="text-2xl font-bold mb-4 border-b border-green-500 pb-1">Search Results</h2>
      {loading ? (
        <p className="text-green-400">Loading search results...</p>
      ) : songs.length === 0 && query ? (
        <p className="text-green-400">No songs found for "{query}".</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} playSong={playSong} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResults;
