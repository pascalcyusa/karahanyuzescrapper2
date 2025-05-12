
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";
import NowPlaying from "@/components/NowPlaying";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile
  const effectiveSidebarOpen = isMobile ? false : isSidebarOpen;
  const effectiveNowPlayingOpen = isMobile ? false : isNowPlayingOpen;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNowPlaying = () => {
    setIsNowPlayingOpen(!isNowPlayingOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div className="flex flex-1 w-full overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar isOpen={effectiveSidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Sidebar Toggle Button (visible when sidebar is closed) */}
        {!effectiveSidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="absolute left-0 top-4 bg-secondary/80 hover:bg-secondary p-2 rounded-r-md z-20"
            aria-label="Open sidebar"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hidden">
          {children}
        </main>

        {/* Now Playing Sidebar */}
        <NowPlaying isOpen={effectiveNowPlayingOpen} toggleNowPlaying={toggleNowPlaying} />
        
        {/* Now Playing Toggle Button (visible when now playing is closed) */}
        {!effectiveNowPlayingOpen && (
          <button 
            onClick={toggleNowPlaying}
            className="absolute right-0 top-4 bg-secondary/80 hover:bg-secondary p-2 rounded-l-md z-20"
            aria-label="Open now playing"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* Music Player Controls - Fixed at bottom */}
      <MusicPlayer />
    </div>
  );
};

export default MainLayout;
