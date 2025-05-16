import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Play, MoreHorizontal, Heart, Clock3, Music } from "lucide-react";
import { doc, getDoc, getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase";

interface Track {
  id: string; // Firestore document ID
  title: string;
  artist: string;
  album: string;
  duration: string;
  liked: boolean;
  order?: number; // Optional: if you want to order tracks
}

interface PlaylistData {
  id: string; // Firestore document ID
  title: string;
  description: string;
  coverImage: string; // URL, potentially from Firebase Storage
  trackCount?: number; // This can be derived from tracks.length
  duration?: string; // This might be calculated or stored
  color?: string; // UI specific, might not be in Firestore
  tracks: Track[];
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

const PlaylistDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Playlist ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchPlaylistDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const db = getFirestore(app);
        const playlistDocRef = doc(db, "playlists", id);
        const playlistSnap = await getDoc(playlistDocRef);

        if (playlistSnap.exists()) {
          const playlistDataFromFirestore = playlistSnap.data() as Omit<PlaylistData, 'id' | 'tracks' | 'coverImage'> & { coverImage: string };
          const coverImageUrl = await getFirebaseStorageUrl(playlistDataFromFirestore.coverImage);

          const playlistBaseData = {
            id: playlistSnap.id,
            ...playlistDataFromFirestore,
            coverImage: coverImageUrl,
          };

          // Fetch tracks from a subcollection named 'tracks' within the playlist document
          const tracksCollectionRef = collection(db, "playlists", id, "tracks");
          // Optionally order tracks if you have an 'order' field or similar
          const tracksQuery = query(tracksCollectionRef, orderBy("order", "asc")); // Or orderBy("title") etc.
          const tracksSnapshot = await getDocs(tracksQuery);

          const tracksData = tracksSnapshot.docs.map(trackDoc => ({
            id: trackDoc.id,
            ...(trackDoc.data() as Omit<Track, 'id'>),
          }));

          setPlaylist({ ...playlistBaseData, tracks: tracksData } as PlaylistData);
        } else {
          setError("Playlist not found.");
        }
      } catch (err) {
        console.error("Error fetching playlist details: ", err);
        setError("Failed to load playlist details. Please try again later.");
      }
      setIsLoading(false);
    };

    fetchPlaylistDetails();
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
          <h2 className="text-2xl font-semibold mb-2">{error || "Playlist not found"}</h2>
          {!error && <p className="text-muted-foreground">The playlist you're looking for doesn't exist or has been removed.</p>}
          {error && <p className="text-muted-foreground">Please try again later or contact support.</p>}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="px-6 pb-24">
        {/* Header */}
        <div className={`flex flex-col md:flex-row items-center md:items-end gap-6 ${playlist.color || 'bg-gray-700'} p-6 rounded-b-lg`}>
          <div className="w-48 h-48 flex-shrink-0 shadow-lg rounded-md overflow-hidden">
            <img
              src={playlist.coverImage || 'https://via.placeholder.com/300'}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{playlist.title}</h1>
            <p className="text-white/80 mb-3">{playlist.description}</p>
            <div className="text-sm text-white/70">
              {playlist.tracks.length} songs
              {playlist.duration && ` • ${playlist.duration}`}
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
            <div className="font-medium hidden md:flex">
              Artist
            </div>
            <div className="font-medium text-right">
              <Clock3 size={16} />
            </div>
          </div>

          {playlist.tracks.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] md:grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-4 py-3 text-sm hover:bg-secondary/50 rounded-md"
            >
              <div className="flex items-center text-muted-foreground">
                {index + 1} {/* Displaying sequential number based on array index */}
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
              <div className="items-center hidden md:flex">
                {track.artist}
              </div>
              <div className="items-center hidden md:flex">
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
