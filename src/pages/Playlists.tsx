
import MainLayout from "@/layouts/MainLayout";
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
  {
    id: 5,
    title: "Daily Mix 1",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop&auto=format&q=80",
    tracks: 22,
    color: "bg-rose-500",
  },
  {
    id: 6,
    title: "Favorites",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop&auto=format&q=80",
    tracks: 45,
    color: "bg-green-600",
  },
  {
    id: 7,
    title: "Chill Vibes",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop&auto=format&q=80",
    tracks: 18,
    color: "bg-blue-400",
  },
  {
    id: 8,
    title: "Workout Mix",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=300&h=300&fit=crop&auto=format&q=80",
    tracks: 25,
    color: "bg-orange-500",
  },
];

const Playlists = () => {
  return (
    <MainLayout>
      <div className="flex flex-col px-6 pb-24">
        <div className="mb-8 pt-6">
          <h1 className="text-3xl font-bold mb-6">All Playlists</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <div key={playlist.id} className={`${playlist.color} rounded-xl overflow-hidden music-card`}>
                <Link to={`/playlists/${playlist.id}`} className="block relative h-full">
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
      </div>
    </MainLayout>
  );
};

export default Playlists;
