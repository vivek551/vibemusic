import React from "react";
import { Play, Pause, SkipBack, SkipForward, ChevronsUp } from "lucide-react";

const MiniPlayer = ({ song, isPlaying, onPlayPause, onNext, onPrev, onExpand }) => {
  if (!song) return null;

  const imageUrl = song?.image?.[1]?.url || "https://via.placeholder.com/50";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-800 bg-opacity-95 backdrop-blur-sm
      shadow-lg flex items-center justify-between px-4 py-2 text-white z-50 cursor-pointer"
      onClick={onExpand}
      aria-label="Open now playing"
    >
      <div className="flex items-center gap-3">
        <img
          src={imageUrl}
          alt={song.name}
          className="w-12 h-12 rounded-md object-cover"
          draggable={false}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex flex-col overflow-hidden">
          <p className="font-semibold truncate max-w-xs">{song.name}</p>
          <p className="text-xs text-red-300 truncate max-w-xs">
            {song.artists?.primary?.[0]?.name || "Unknown Artist"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label="Previous"
          onClick={onPrev}
          className="p-2 rounded-full hover:bg-red-600 transition"
        >
          <SkipBack size={20} />
        </button>
        <button
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={onPlayPause}
          className="p-2 rounded-full bg-white text-red-700 hover:bg-red-200 transition"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          aria-label="Next"
          onClick={onNext}
          className="p-2 rounded-full hover:bg-red-600 transition"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <button
        aria-label="Expand now playing"
        onClick={(e) => {
          e.stopPropagation();
          onExpand();
        }}
        className="p-2 rounded-full hover:bg-red-600 transition ml-4"
      >
        <ChevronsUp size={20} />
      </button>
    </div>
  );
};

export default MiniPlayer;
