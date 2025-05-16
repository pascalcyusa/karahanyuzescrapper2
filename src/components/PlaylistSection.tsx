
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, limit, query } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Added Storage imports
import { app } from "@/lib/firebase";

interface Playlist {
  id: string;
  title: string;
  image: string;
  tracksCount: number;
  color?: string;
}

// Helper function to get download URL from Firebase Storage path (can be moved to a utils file)
const getFirebaseStorageUrl = async (imagePath: string): Promise<string> => {
  if (!imagePath) return 'https://via.placeholder.com/300'; // Fallback for empty path
  if (imagePath.startsWith('gs://') || imagePath.startsWith('https://firebasestorage.googleapis.com')) {
    try {
      const storage = getStorage(app);
      const pathReference = ref(storage, imagePath);
      return await getDownloadURL(pathReference);
    } catch (error) {
      console.warn(`Failed to get download URL for ${imagePath}, returning original path:`, error);
      return imagePath;
    }
  } else if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
    try {
      const storage = getStorage(app);
      const pathReference = ref(storage, imagePath);
      return await getDownloadURL(pathReference);
    } catch (error) {
      console.warn(`Failed to get download URL for ${imagePath}, returning original path:`, error);
      return imagePath;
    }
  }
  return imagePath;
};

interface PlaylistSectionProps {
  title: string;
}

const PlaylistSection = ({ title }: PlaylistSectionProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore(app);
        const playlistsCollection = collection(db, "playlists");
        const q = query(playlistsCollection, limit(4));
        const playlistSnapshot = await getDocs(q);
        const playlistsDataPromises = playlistSnapshot.docs.map(async (doc) => {
          const data = doc.data() as Omit<Playlist, 'id' | 'image'> & { image: string };
          const imageUrl = await getFirebaseStorageUrl(data.image);
          return {
            id: doc.id,
            ...data,
            image: imageUrl,
          };
        });
        const resolvedPlaylistsData = await Promise.all(playlistsDataPromises);
        setPlaylists(resolvedPlaylistsData as Playlist[]);
      } catch (err) {
        console.error("Error fetching playlists for section: ", err);
        setError("Failed to load playlists.");
      }
      setLoading(false);
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    // Optional: Add a more sophisticated loading state, e.g., skeleton loaders
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p>Loading playlists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (playlists.length === 0 && !loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p>No playlists to display in this section.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link to="/playlists" className="text-sm text-muted-foreground hover:text-white">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <div key={playlist.id} className={`${playlist.color || 'bg-gray-700'} rounded-xl overflow-hidden music-card`}>
            <Link to={`/playlists/${playlist.id}`} className="block relative h-full">
              <div className="aspect-square overflow-hidden">
                <img
                  src={playlist.image || 'https://via.placeholder.com/300'}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">{playlist.title}</h3>
                <p className="text-sm text-white/70">{playlist.tracksCount} tracks</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistSection;
