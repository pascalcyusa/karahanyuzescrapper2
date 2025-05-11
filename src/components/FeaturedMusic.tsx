
import { Play } from "lucide-react";

const FeaturedMusic = () => {
  return (
    <div className="relative overflow-hidden rounded-xl music-card bg-kplayer-green h-64 md:h-80">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full p-6 md:p-8 z-10">
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-medium">Billie Eilish</h3>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-shadow">
              What Was I Made For?
            </h2>
            <button className="flex items-center gap-2 bg-white text-black font-medium px-5 py-2 rounded-full hover:bg-opacity-90 transition-all">
              <Play size={18} /> Listen now
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full">
          <div className="relative h-full">
            <img
              src="https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=800&fit=crop&auto=format&q=80"
              alt="Billie Eilish"
              className="h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-kplayer-green via-kplayer-green/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMusic;
