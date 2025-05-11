
import { Link } from "react-router-dom";

const playlists = [
  {
    id: 1,
    title: "Dejavu",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&auto=format&q=80",
    tracks: 30,
    color: "bg-amber-500",
  },
  {
    id: 2,
    title: "Playlist of the day",
    image: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=300&h=300&fit=crop&auto=format&q=80",
    tracks: 28,
    color: "bg-blue-700",
  },
  {
    id: 3,
    title: "Something new",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format&q=80",
    tracks: 37,
    color: "bg-purple-400",
  },
  {
    id: 4,
    title: "Exclusive show",
    image: "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=300&h=300&fit=crop&auto=format&q=80",
    tracks: 17,
    color: "bg-kplayer-green",
  },
];

interface PlaylistSectionProps {
  title: string;
}

const PlaylistSection = ({ title }: PlaylistSectionProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link to="/" className="text-sm text-muted-foreground hover:text-white">
          View all
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <div key={playlist.id} className={`${playlist.color} rounded-xl overflow-hidden music-card`}>
            <Link to="/" className="block relative h-full">
              <div className="aspect-square overflow-hidden">
                <img
                  src={playlist.image}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">{playlist.title}</h3>
                <p className="text-sm text-white/70">{playlist.tracks} tracks</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistSection;
