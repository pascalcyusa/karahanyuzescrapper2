
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";
import NowPlaying from "@/components/NowPlaying";
import { useIsMobile } from "@/hooks/use-mobile";

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
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={effectiveSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hidden">
          {children}
        </main>

        {/* Now Playing Sidebar */}
        <NowPlaying isOpen={effectiveNowPlayingOpen} toggleNowPlaying={toggleNowPlaying} />
      </div>

      {/* Music Player Controls - Fixed at bottom */}
      <MusicPlayer />
    </div>
  );
};

export default MainLayout;
