import React from "react";
import { motion } from "framer-motion";

const SongCard = ({ song, playSong }) => {
  const imageUrl = song?.image?.[1]?.url || "https://via.placeholder.com/150";
  const title = song?.name || "Unknown Title";
  const artistName = song?.artists?.primary?.[0]?.name || "Unknown Artist";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-full bg-gray-800 rounded-xl p-3 cursor-pointer shadow-md flex flex-col
        text-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
      onClick={() => playSong(song)}
    >
      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-2">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-green-700 to-transparent opacity-60"></div>
      </div>
      <p className="font-semibold truncate text-green-400">{title}</p>
      <p className="text-sm truncate text-green-300">{artistName}</p>
    </motion.div>
  );
};

export default SongCard;
