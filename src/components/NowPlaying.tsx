
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NowPlayingProps {
  isOpen: boolean;
  toggleNowPlaying: () => void;
}

const nowPlayingTracks = [
  {
    id: 1,
    title: "Cruel",
    artist: "Jackson Wang",
    duration: "03:28",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop&auto=format&q=80",
    isPlaying: true,
  },
  {
    id: 2,
    title: "Gum",
    artist: "Jessie",
    duration: "2:42",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=100&h=100&fit=crop&auto=format&q=80",
  },
  {
    id: 3,
    title: "Softcore",
    artist: "The Neighbourhood",
    duration: "3:26",
    image: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=100&h=100&fit=crop&auto=format&q=80",
  },
  {
    id: 4,
    title: "Mockingbird",
    artist: "Eminem",
    duration: "4:10",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&auto=format&q=80",
  },
  {
    id: 5,
    title: "Get money i love it",
    artist: "Bloo",
    duration: "2:19",
    image: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=100&h=100&fit=crop&auto=format&q=80",
  },
  {
    id: 6,
    title: "MOVE",
    artist: "TAEMIN",
    duration: "3:31",
    image: "https://images.unsplash.com/photo-1493843007199-f4397137f7d9?w=100&h=100&fit=crop&auto=format&q=80",
  },
  {
    id: 7,
    title: "In The Party",
    artist: "Flo Milli",
    duration: "2:17",
    image: "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?w=100&h=100&fit=crop&auto=format&q=80",
  },
];

const NowPlaying = ({ isOpen, toggleNowPlaying }: NowPlayingProps) => {
  return (
    <aside
      className={cn(
        "bg-secondary w-72 flex flex-col border-l border-muted transition-all duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-muted">
        <h2 className="font-bold text-lg">Now playing</h2>
        <button onClick={toggleNowPlaying}>
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hidden">
        <div className="flex flex-col">
          {nowPlayingTracks.map((track) => (
            <div 
              key={track.id}
              className={cn(
                "flex items-center p-3 hover:bg-muted/50 cursor-pointer transition-colors",
                track.isPlaying && "bg-muted"
              )}
            >
              <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                <img 
                  src={track.image} 
                  alt={track.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex flex-col">
                  <span className={cn(
                    "font-medium text-sm truncate",
                    track.isPlaying && "text-primary"
                  )}>
                    {track.title}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {track.artist}
                  </span>
                </div>
              </div>
              <div className="ml-2 text-xs text-muted-foreground">
                {track.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default NowPlaying;
