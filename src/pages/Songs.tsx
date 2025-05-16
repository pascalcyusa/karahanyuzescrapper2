import MainLayout from "@/layouts/MainLayout";
import { useState } from 'react';
import { storage, db } from '@/lib/firebase'; // Assuming firebase.ts exports storage and db
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast"; // For user feedback

const SongsPage = () => {
    const { toast } = useToast();
    const [songFile, setSongFile] = useState<File | null>(null);
    const [songName, setSongName] = useState('');
    const [artistName, setArtistName] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSongFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
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

        // Create a storage reference
        // Store the song in a folder whose name is under a given artist
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
                // Upload completed successfully, now get the download URL
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // Save song metadata to Firestore
                    await addDoc(collection(db, 'songs'), {
                        name: songName.trim(),
                        artist: artistName.trim(),
                        collection: collectionName.trim() || null, // Store as null if empty
                        url: downloadURL,
                        fileName: songFile.name,
                        createdAt: serverTimestamp(),
                        // You might want to add userId if users are uploading songs
                    });

                    toast({
                        title: "Upload Successful",
                        description: `"${songName.trim()}" has been uploaded.`,
                    });
                    // Reset form
                    setSongFile(null);
                    setSongName('');
                    setArtistName('');
                    setCollectionName('');
                    // Clear the file input visually
                    const fileInput = document.getElementById('songFile') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';

                } catch (error: any) {
                    console.error("Error saving song metadata: ", error);
                    toast({
                        title: "Error",
                        description: "Failed to save song details after upload. " + error.message,
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
                                accept="audio/*"
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
                            disabled={isUploading}
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

                {/* Placeholder for displaying uploaded songs or status messages */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">Uploaded Songs</h2>
                    <p className="text-muted-foreground">Songs you upload will appear here.</p>
                    {/* Later, this area will list songs from Firebase */}
                </div>
            </div>
        </MainLayout>
    );
};

export default SongsPage;