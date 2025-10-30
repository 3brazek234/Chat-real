
import { User } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
function UserListChild({
  user,
  selectedUser,
  handleSelect,
  isOnline,
}: {
  user: User;
  selectedUser: User | null;
  handleSelect: (user: User | null) => void;
  isOnline: boolean;
}) {
  return (
    <button
      key={user.id}
      onClick={() => handleSelect(user)}
      className={`w-full p-4 flex items-center gap-3 transition-colors border-b border-purple-800/30 ${
        selectedUser?.id === user.id ? "selected-user" : "hover:bg-white/3"
      }`}
    >
      <div className="flex items-center gap-3.5">
        
        
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
  
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-purple-900 
                      ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}
            title={isOnline ? "Online" : "Offline"}
          ></span>
        </div>

        <div className="text-left">
          <p className="font-medium text-white">{user.name}</p>
        </div>
      </div>
    </button>
  );
}

export default UserListChild;