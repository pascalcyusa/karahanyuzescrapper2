
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Play, MoreHorizontal, Heart, Clock3, Music } from "lucide-react";

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  liked: boolean;
}

interface PlaylistData {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  trackCount: number;
  duration: string;
  color: string;
  tracks: Track[];
}

const PlaylistDetails = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch playlist data
    const fetchPlaylist = async () => {
      setIsLoading(true);
      
      // Simulate network request
      setTimeout(() => {
        const mockPlaylist: PlaylistData = {
          id: Number(id),
          title: id === "1" ? "Dejavu" : id === "2" ? "Playlist of the day" : id === "3" ? "Something new" : "Exclusive show",
          description: "A curated playlist with your favorite tracks for every mood",
          coverImage: id === "1" 
            ? "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&auto=format&q=80"
            : id === "2" 
              ? "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=300&h=300&fit=crop&auto=format&q=80" 
              : id === "3"
                ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format&q=80"
                : "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=300&h=300&fit=crop&auto=format&q=80",
          trackCount: 30,
          duration: "1 hr 45 min",
          color: id === "1" 
            ? "bg-amber-500" 
            : id === "2" 
              ? "bg-blue-700" 
              : id === "3" 
                ? "bg-purple-400" 
                : "bg-kplayer-green",
          tracks: Array(12).fill(null).map((_, index) => ({
            id: index + 1,
            title: `Track ${index + 1}`,
            artist: `Artist ${Math.floor(index / 3) + 1}`,
            album: `Album ${Math.floor(index / 4) + 1}`,
            duration: `${Math.floor(Math.random() * 2) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            liked: Math.random() > 0.7,
          })),
        };
        
        setPlaylist(mockPlaylist);
        setIsLoading(false);
      }, 1000);
    };

    fetchPlaylist();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex flex-col w-full max-w-3xl">
            <div className="h-64 bg-secondary/50 rounded-md mb-4"></div>
            <div className="h-8 bg-secondary/50 rounded-md w-1/3 mb-4"></div>
            <div className="h-4 bg-secondary/50 rounded-md w-2/3 mb-8"></div>
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="h-12 bg-secondary/50 rounded-md mb-2"></div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!playlist) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-semibold mb-2">Playlist not found</h2>
          <p className="text-muted-foreground">The playlist you're looking for doesn't exist or has been removed.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="px-6 pb-24">
        {/* Header */}
        <div className={`flex flex-col md:flex-row items-center md:items-end gap-6 ${playlist.color} p-6 rounded-b-lg`}>
          <div className="w-48 h-48 flex-shrink-0 shadow-lg rounded-md overflow-hidden">
            <img 
              src={playlist.coverImage} 
              alt={playlist.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{playlist.title}</h1>
            <p className="text-white/80 mb-3">{playlist.description}</p>
            <div className="text-sm text-white/70">
              {playlist.trackCount} songs • {playlist.duration} 
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 my-6">
          <Button size="lg" className="rounded-full px-8">
            <Play className="mr-2" /> Play
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full">
            <Heart />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full">
            <MoreHorizontal />
          </Button>
        </div>

        {/* Tracks list */}
        <div className="w-full">
          <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] md:grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-muted">
            <div className="font-medium">#</div>
            <div className="font-medium">Title</div>
            <div className="font-medium hidden sm:block">Album</div>
            <div className="font-medium hidden md:block">Artist</div>
            <div className="font-medium text-right">
              <Clock3 size={16} />
            </div>
          </div>

          {playlist.tracks.map((track) => (
            <div 
              key={track.id}
              className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] md:grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-4 py-3 text-sm hover:bg-secondary/50 rounded-md"
            >
              <div className="flex items-center text-muted-foreground">
                {track.id}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted flex items-center justify-center rounded-md">
                  <Music size={16} />
                </div>
                <div>
                  <div className="font-medium">{track.title}</div>
                  <div className="text-xs text-muted-foreground md:hidden">
                    {track.artist}
                  </div>
                </div>
              </div>
              <div className="flex items-center hidden sm:flex">
                {track.album}
              </div>
              <div className="flex items-center hidden md:flex">
                {track.artist}
              </div>
              <div className="flex items-center justify-end">
                <Heart size={16} className={track.liked ? "text-primary fill-primary" : "text-muted-foreground"} />
                <span className="ml-4">{track.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default PlaylistDetails;
