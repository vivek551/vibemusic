import React from "react";

const ArtistList = ({ artists }) => {
  return (
    <section className="w-full max-w-6xl mb-8">
      <h2 className="text-2xl font-bold mb-4 border-b border-green-500 pb-1">Popular Artists</h2>
      <div className="flex overflow-x-auto gap-6 hide-scrollbar py-2">
        {artists.length === 0
          ? Array(5).fill(null).map((_, idx) => (
              <div key={idx} className="min-w-[120px] h-32 bg-gray-800 rounded-lg animate-pulse" />
            ))
          : artists.map(({ name, image, id }) => (
              <div
                key={id || name}
                className="min-w-[120px] flex-shrink-0 flex flex-col items-center cursor-pointer
                hover:scale-105 transition-transform"
              >
                <img
                  src={image}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover mb-2 shadow-lg border-2 border-green-500"
                  draggable={false}
                />
                <p className="text-sm font-semibold text-white truncate max-w-[100px] text-center">{name}</p>
              </div>
            ))}
      </div>
    </section>
  );
};

export default ArtistList;
