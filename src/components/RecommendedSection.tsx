
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

const recommendedSongs = [
  {
    id: 1,
    title: "Drunk-Dazed",
    artist: "ENHYPEN",
    duration: "3:13",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150&h=150&fit=crop&auto=format&q=80",
    color: "bg-red-600",
  },
  {
    id: 2,
    title: "Wrecked",
    artist: "Imagine Dragons",
    duration: "4:04",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=150&h=150&fit=crop&auto=format&q=80",
    color: "bg-amber-700",
  },
];

interface RecommendedSectionProps {
  title: string;
}

const RecommendedSection = ({ title }: RecommendedSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <a href="#" className="text-sm text-muted-foreground hover:text-white">
          View all
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedSongs.map((song) => (
          <div 
            key={song.id}
            className={cn(
              "rounded-xl overflow-hidden relative music-card flex items-center",
              song.color
            )}
          >
            <div className="flex items-center w-full p-3">
              <div className="w-20 h-20 shrink-0">
                <img 
                  src={song.image} 
                  alt={song.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium">{song.title}</h3>
                <p className="text-sm text-white/70">{song.artist}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/70">{song.duration}</span>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Play size={18} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedSection;
