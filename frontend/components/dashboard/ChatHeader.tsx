import { User } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface ChatHeaderProps {
  user: User;
}

export const ChatHeader = ({ user  }: ChatHeaderProps) => (
  <div className="p-4  flex items-center gap-3 ms-8">
    <div>
      <Avatar>
        <AvatarImage src={user.avatar_url || ""} alt={user.name} />
        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>

  </div>
);
