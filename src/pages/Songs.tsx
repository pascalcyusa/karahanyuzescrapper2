import MainLayout from "@/layouts/MainLayout";
import { useState } from 'react';
import { storage, db, auth } from '@/lib/firebase'; // Import auth
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";

const SongsPage = () => {
    const { toast } = useToast();
    const [songFile, setSongFile] = useState<File | null>(null);
    const [songName, setSongName] = useState('');
    const [artistName, setArtistName] = useState('');
    const [collectionName, setCollectionName] = useState(''); // For album/collection name
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSongFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        // Get the current user
        const currentUser = auth.currentUser;

        if (!currentUser) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to upload songs.",
                variant: "destructive",
            });
            setIsUploading(false); // Ensure uploading state is reset
            return;
        }

        if (!songFile) {
            toast({
                title: "Error",
                description: "Please select a song file to upload.",
                variant: "destructive",
            });
            return;
        }
        if (!songName.trim()) {
            toast({
                title: "Error",
                description: "Please enter the song name.",
                variant: "destructive",
            });
            return;
        }
        if (!artistName.trim()) {
            toast({
                title: "Error",
                description: "Please enter the artist name.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        const storageRef = ref(storage, `songs/${artistName.trim()}/${songFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, songFile);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                toast({
                    title: "Upload Failed",
                    description: error.message || "An unknown error occurred during upload.",
                    variant: "destructive",
                });
                setIsUploading(false);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // Prepare song data for Firestore
                    const songData = {
                        name: songName.trim(),
                        artist: artistName.trim(),
                        collection: collectionName.trim() || null, // Keep 'collection' if that's your DB field name
                        url: downloadURL,
                        fileName: songFile.name,
                        uploaderUid: currentUser.uid, // Add the uploader's ID
                        createdAt: serverTimestamp(),
                        // Add any other relevant fields like duration, genre, etc.
                    };

                    console.log("Attempting to save songData to Firestore:", songData); // Log data before sending

                    await addDoc(collection(db, 'songs'), songData);

                    toast({
                        title: "Upload Successful",
                        description: `"${songData.name}" has been uploaded.`,
                    });

                    // Reset form state
                    setSongFile(null);
                    setSongName('');
                    setArtistName('');
                    setCollectionName('');
                    const fileInput = document.getElementById('songFile') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';

                } catch (error: any) {
                    console.error("Error saving song metadata: ", error);
                    console.error("Error details:", error.code, error.message); // Log more error details
                    toast({
                        title: "Error Saving Metadata",
                        description: `Failed to save song details: ${error.message || 'Unknown Firestore error.'}`,
                        variant: "destructive",
                    });
                } finally {
                    setIsUploading(false);
                    setUploadProgress(0);
                }
            }
        );
    };

    return (
        <MainLayout>
            <div className="p-4 md:p-6">
                <h1 className="text-2xl font-semibold mb-4">Upload Songs</h1>

                <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-md">
                    <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }} className="space-y-4">
                        <div>
                            <label htmlFor="songFile" className="block text-sm font-medium text-muted-foreground mb-1">Song File</label>
                            <input
                                type="file"
                                id="songFile"
                                accept="audio/*,.mp3,.wav,.m4a,.flac" // Be more specific with audio types
                                onChange={handleFileChange}
                                disabled={isUploading}
                                className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="songName" className="block text-sm font-medium text-muted-foreground mb-1">Song Name</label>
                            <input
                                type="text"
                                id="songName"
                                placeholder="Enter song name"
                                value={songName}
                                onChange={(e) => setSongName(e.target.value)}
                                disabled={isUploading}
                                required // Make fields required at HTML level too
                                className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="artistName" className="block text-sm font-medium text-muted-foreground mb-1">Artist Name</label>
                            <input
                                type="text"
                                id="artistName"
                                placeholder="Enter artist name"
                                value={artistName}
                                onChange={(e) => setArtistName(e.target.value)}
                                disabled={isUploading}
                                required
                                className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="collectionName" className="block text-sm font-medium text-muted-foreground mb-1">Collection/Album (Optional)</label>
                            <input
                                type="text"
                                id="collectionName"
                                placeholder="Enter collection or album name"
                                value={collectionName}
                                onChange={(e) => setCollectionName(e.target.value)}
                                disabled={isUploading}
                                className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isUploading || !songFile || !songName.trim() || !artistName.trim()} // More robust disable condition
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {isUploading ? `Uploading... ${uploadProgress.toFixed(0)}%` : 'Upload Song'}
                        </button>
                        {isUploading && (
                            <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">Uploaded Songs</h2>
                    <p className="text-muted-foreground">Songs you upload will appear here.</p>
                    {/* TODO: Fetch and display songs from Firestore here */}
                </div>
            </div>
        </MainLayout>
    );
};

export default SongsPage;
