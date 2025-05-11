
import { Play, SkipBack, SkipForward, Volume2, ListMusic, Repeat, Shuffle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MusicPlayer = () => {
  // In a real app, these would come from your music player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(92); // seconds
  const [duration, setDuration] = useState(208); // seconds
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const progress = (currentTime / duration) * 100;
  
  return (
    <div className="h-20 bg-secondary border-t border-muted px-4 flex items-center">
      <div className="flex items-center w-1/4">
        <div className="w-12 h-12 rounded overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop&auto=format&q=80" 
            alt="Now playing" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <h4 className="text-sm font-medium">Cruel</h4>
          <p className="text-xs text-muted-foreground">Jackson Wang</p>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 mb-2">
          <button className="text-muted-foreground hover:text-white transition-colors">
            <Shuffle size={18} />
          </button>
          <button className="text-white hover:text-primary transition-colors">
            <SkipBack size={22} />
          </button>
          <button 
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              "bg-white text-black hover:bg-opacity-90 transition-colors"
            )}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <Play size={18} fill="currentColor" />
          </button>
          <button className="text-white hover:text-primary transition-colors">
            <SkipForward size={22} />
          </button>
          <button className="text-muted-foreground hover:text-white transition-colors">
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="w-full max-w-md flex items-center gap-2">
          <span className="text-xs text-muted-foreground min-w-8">
            {formatTime(currentTime)}
          </span>
          <div className="h-1 bg-muted flex-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-muted-foreground min-w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      
      <div className="w-1/4 flex items-center justify-end gap-4">
        <button className="text-muted-foreground hover:text-white transition-colors">
          <ListMusic size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Volume2 size={18} className="text-muted-foreground" />
          <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-white w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
