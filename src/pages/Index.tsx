
import MainLayout from "@/layouts/MainLayout";
import SearchBar from "@/components/SearchBar";
import FeaturedMusic from "@/components/FeaturedMusic";
import { User } from 'firebase/auth'; // Import User type
import PlaylistSection from "@/components/PlaylistSection";
import RecommendedSection from "@/components/RecommendedSection";

interface IndexProps {
  user: User | null;
}

const Index: React.FC<IndexProps> = ({ user }) => {
  return (
    <MainLayout>
      <div className="flex flex-col">
        <SearchBar />
        
        <div className="px-6 pb-24">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6">{user ? `Welcome, ${user.displayName || 'User'}` : 'Main'}</h1>
            <FeaturedMusic />
          </div>
          
          <PlaylistSection title="Playlists for you" />
          
          <RecommendedSection title="You may also like" />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
