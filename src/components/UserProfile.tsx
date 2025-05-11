
import { cn } from "@/lib/utils";

interface UserProfileProps {
  className?: string;
}

const UserProfile = ({ className }: UserProfileProps) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="font-medium text-sm md:text-base">Tasha E.</span>
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&auto=format&q=80"
          alt="User profile"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default UserProfile;
