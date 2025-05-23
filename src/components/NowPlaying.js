import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, X } from "lucide-react";

const NowPlaying = ({
  song,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onClose,
}) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, song]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [song]);

  const formatTime = (sec) => {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  if (!song) return null;

  const imageUrl = song?.image?.[2]?.url || song?.image?.[1]?.url || "https://via.placeholder.com/400";

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 bg-black bg-opacity-95 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-6 text-white"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition"
      >
        <X size={28} />
      </button>

      <img
        src={imageUrl}
        alt={song.name}
        className="w-72 h-72 rounded-xl shadow-2xl mb-6 object-cover"
        draggable={false}
      />

      <h2 className="text-3xl font-bold mb-1 text-center truncate max-w-xs">{song.name}</h2>
      <p className="text-red-400 text-lg mb-6 text-center truncate max-w-xs">
        {song.artists?.primary?.[0]?.name || "Unknown Artist"}
      </p>

      <input
        type="range"
        min={0}
        max={duration || 0}
        value={progress}
        onChange={handleSeek}
        className="w-full h-1 rounded-lg accent-red-600 mb-2"
      />
      <div className="w-full flex justify-between text-sm text-red-400 mb-6 px-1 select-none">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex items-center gap-10">
        <button
          aria-label="Previous"
          onClick={onPrev}
          className="p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition"
        >
          <SkipBack size={36} />
        </button>

        <button
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={onPlayPause}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition shadow-lg"
        >
          {isPlaying ? <Pause size={36} /> : <Play size={36} />}
        </button>

        <button
          aria-label="Next"
          onClick={onNext}
          className="p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition"
        >
          <SkipForward size={36} />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={song.audioSrc}
        preload="metadata"
        onEnded={onNext}
      />
    </motion.div>
  );
};

export default NowPlaying;
