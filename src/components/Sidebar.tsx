
import { Menu, Home, Radio, Mic2, Book, Music, Disc, Users, List, File, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const navItems = [
    { label: "Main", icon: Home, href: "/" },
    { label: "Radio", icon: Radio, href: "/" },
    { label: "Podcasts", icon: Mic2, href: "/" },
    { label: "Books", icon: Book, href: "/" },
  ];

  const myMusicItems = [
    { label: "Tracks", icon: Music, href: "/" },
    { label: "Albums", icon: Disc, href: "/" },
    { label: "Artists", icon: Users, href: "/" },
    { label: "Playlists", icon: List, href: "/" },
    { label: "Files", icon: File, href: "/" },
  ];

  const settingsItems = [
    { label: "Setting", icon: Settings, href: "/" },
    { label: "Log out", icon: LogOut, href: "/" },
  ];

  return (
    <aside
      className={cn(
        "bg-secondary w-64 flex flex-col transition-all duration-300 shrink-0 border-r border-muted z-10",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4 flex items-center">
        <button onClick={toggleSidebar} className="mr-3">
          <Menu size={24} />
        </button>
        <span className="font-bold text-xl">KPlayer</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto scrollbar-hidden">
        <div className="mb-6">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <div className="px-7 mb-2 text-sm font-medium text-muted-foreground">
            My music
          </div>
          <ul className="space-y-2 px-3">
            {myMusicItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      <div className="mt-auto border-t border-muted">
        <ul className="p-3 space-y-2">
          {settingsItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors"
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
