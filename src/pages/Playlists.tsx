
import MainLayout from "@/layouts/MainLayout";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button"; // Added Button
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // Added Dialog components
import { Input } from "@/components/ui/input"; // Added Input for playlist name
import { ScrollArea } from "@/components/ui/scroll-area"; // For song list
import { Checkbox } from "@/components/ui/checkbox"; // For selecting songs
import { Label } from "@/components/ui/label"; // For checkbox labels
import { useToast } from "@/components/ui/use-toast"; // Added for notifications
import { collection, getDocs, getFirestore, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore"; // Added addDoc, serverTimestamp, query, orderBy
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase";

interface Playlist {
  id: string;
  title: string;
  image: string;
  tracksCount: number;
  color: string;
}

// Helper function to get download URL from Firebase Storage path
const getFirebaseStorageUrl = async (imagePath: string): Promise<string> => {
  if (imagePath.startsWith('gs://') || imagePath.startsWith('https://firebasestorage.googleapis.com')) {
    // If it's already a gs:// path or a Firebase Storage HTTPS URL, try to get a new download URL
    // This handles cases where it might be a gs path or an old URL that might expire
    try {
      const storage = getStorage(app);
      // For gs:// paths, we need to extract the path after the bucket
      const pathReference = ref(storage, imagePath);
      return await getDownloadURL(pathReference);
    } catch (error) {
      console.warn(`Failed to get download URL for ${imagePath}, returning original path:`, error);
      return imagePath; // Fallback to original path if URL retrieval fails
    }
  } else if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
    // If it's a relative path (e.g., 'images/playlist.jpg'), assume it's a Firebase Storage path
    try {
      const storage = getStorage(app);
      const pathReference = ref(storage, imagePath);
      return await getDownloadURL(pathReference);
    } catch (error) {
      console.warn(`Failed to get download URL for ${imagePath}, returning original path:`, error);
      return imagePath; // Fallback to original path
    }
  }
  // If it's already an HTTP/HTTPS URL (and not a Firebase Storage one), return as is
  return imagePath;
};

interface Song {
  id: string;
  name: string;
  artist: string;
  url: string;
  // Add other relevant song properties if they exist in your Firestore 'songs' collection
}

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]); // Songs loaded from Firebase
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const { toast } = useToast(); // Assuming useToast is available globally or imported

  const fetchPlaylists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const db = getFirestore(app);
      const playlistsCollection = collection(db, "playlists");
      const playlistSnapshot = await getDocs(playlistsCollection);
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
      console.error("Error fetching playlists: ", err);
      setError("Failed to load playlists. Please try again later.");
    }
    setLoading(false);
  }, [app, getFirebaseStorageUrl, setPlaylists, setLoading, setError]); // Added app and getFirebaseStorageUrl to dependencies

  const fetchAvailableSongs = async () => {
    setLoadingSongs(true);
    try {
      const db = getFirestore(app);
      const songsCollection = collection(db, "songs");
      // Optionally, order songs by name or creation date
      const q = query(songsCollection, orderBy("name"));
      const songsSnapshot = await getDocs(q);
      const songsData = songsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Song, 'id'>)
      })) as Song[];
      setAvailableSongs(songsData);
    } catch (err) {
      console.error("Error fetching songs: ", err);
      toast({
        title: "Error Loading Songs",
        description: "Could not load songs to add to the playlist.",
        variant: "destructive",
      });
      setAvailableSongs([]); // Clear or set to empty on error
    } finally {
      setLoadingSongs(false);
    }
  };

  const handleOpenCreatePlaylistModal = () => {
    fetchAvailableSongs(); // Load songs when modal opens
    setIsCreatePlaylistModalOpen(true);
  };

  const handleSongSelectionChange = (songId: string) => {
    setSelectedSongIds(prevSelected =>
      prevSelected.includes(songId)
        ? prevSelected.filter(id => id !== songId)
        : [...prevSelected, songId]
    );
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast({
        title: "Playlist Name Required",
        description: "Please enter a name for your playlist.",
        variant: "destructive",
      });
      return;
    }
    if (selectedSongIds.length === 0) {
      toast({
        title: "No Songs Selected",
        description: "Please select at least one song for your playlist.",
        variant: "default", // Or 'destructive' if it's a hard requirement
      });
      // return; // Decide if an empty playlist is allowed
    }

    try {
      const db = getFirestore(app);
      const newPlaylistData = {
        title: newPlaylistName.trim(),
        songIds: selectedSongIds, // Store array of song IDs
        tracksCount: selectedSongIds.length,
        createdAt: serverTimestamp(),
        // You might want a default image or allow users to upload one later
        image: "https://via.placeholder.com/300/000000/FFFFFF?text=Playlist", // Placeholder image
        // Add userId if playlists are user-specific
        // userId: auth.currentUser?.uid, 
      };

      await addDoc(collection(db, "playlists"), newPlaylistData);

      toast({
        title: "Playlist Created!",
        description: `"${newPlaylistName.trim()}" has been successfully created.`,
      });

      setNewPlaylistName("");
      setSelectedSongIds([]);
      setIsCreatePlaylistModalOpen(false);
      fetchPlaylists(); // Re-fetch playlists to show the new one
    } catch (error: any) {
      console.error("Error creating playlist: ", error);
      toast({
        title: "Creation Failed",
        description: "Could not create the playlist. " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col px-6 pb-24 pt-6 items-center justify-center">
          <p>Loading playlists...</p> {/* Replace with a proper spinner/skeleton loader */}
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col px-6 pb-24 pt-6 items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col px-6 pb-24 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Playlists</h1>
          <Button onClick={handleOpenCreatePlaylistModal}>Create New Playlist</Button>
        </div>

        {/* Existing playlist display logic */}
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <p className="text-lg text-muted-foreground">You haven't created any playlists yet.</p>
            <Button onClick={handleOpenCreatePlaylistModal} className="mt-4">Create Your First Playlist</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {playlists.map((playlist) => (
              <Link key={playlist.id} to={`/playlists/${playlist.id}`} className="group">
                <div
                  className="aspect-square rounded-md overflow-hidden relative bg-cover bg-center transition-all duration-300 group-hover:shadow-lg"
                  style={{ backgroundImage: `url(${playlist.image})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <h3 className="text-white font-semibold text-base truncate group-hover:underline">
                      {playlist.title}
                    </h3>
                    <p className="text-xs text-neutral-300">
                      {playlist.tracksCount} tracks
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Playlist Modal */}
      <Dialog open={isCreatePlaylistModalOpen} onOpenChange={setIsCreatePlaylistModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
            <DialogDescription>
              Give your new playlist a name and select songs to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="playlistName" className="text-right">
                Name
              </Label>
              <Input
                id="playlistName"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="col-span-3"
                placeholder="My Awesome Mix"
              />
            </div>
            <div className="mt-2">
              <Label className="mb-2 block">Add Songs</Label>
              {loadingSongs ? (
                <p>Loading songs...</p>
              ) : availableSongs.length > 0 ? (
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  {availableSongs.map(song => (
                    <div key={song.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`song-${song.id}`}
                        checked={selectedSongIds.includes(song.id)}
                        onCheckedChange={() => handleSongSelectionChange(song.id)}
                      />
                      <Label htmlFor={`song-${song.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {song.name} - <span className="text-xs text-muted-foreground">{song.artist}</span>
                      </Label>
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">No songs available to add. Upload songs first.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleCreatePlaylist}>Create Playlist</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );

};

export default Playlists;
