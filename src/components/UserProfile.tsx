
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStatus } from "@/hooks/useAuthStatus"; // Added import
import { useNavigate } from "react-router-dom"; // Added import

interface UserProfileProps {
  className?: string;
}

const UserProfile = ({ className }: UserProfileProps) => {
  const { signOutUser } = useAuthStatus(); // Added hook usage
  const navigate = useNavigate(); // Added hook usage

  const handleLogout = async () => {
    await signOutUser();
    navigate("/signin");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("focus:outline-none", className)}>
        <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          <AvatarImage 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&auto=format&q=80"
            alt="User profile" 
          />
          <AvatarFallback>TE</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover">
        <DropdownMenuItem className="cursor-pointer">
          <User size={16} className="mr-2" />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <User size={16} className="mr-2" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings size={16} className="mr-2" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut size={16} className="mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
