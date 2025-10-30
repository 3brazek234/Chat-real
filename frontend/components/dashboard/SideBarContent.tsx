import { LogOut, MessageSquare, Search } from "lucide-react";
import UserListChild from "./UserListChild";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserProfileDialog } from "./UserProfileDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "@/context/useAuth";
import { User } from "@/types/chat";
interface SideBarContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSelect: (user: User | null) => void;
  filteredUsers: User[];
  selectedUser: User | null;
  onlineUsersSet: Set<string>;
}
const SideBarContent = ({
  searchQuery,
  setSearchQuery,
  handleSelect,
  filteredUsers,
  selectedUser,
  onlineUsersSet,
}: SideBarContentProps) => {
  const { logout } = useAuth();
  return (
    <div className="flex flex-col h-full bg-purple-950/30 backdrop-blur-md text-white">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-900/90 to-purple-800/90 border-b border-purple-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <MessageSquare className="h-5 w-5 text-purple-300" />
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-300">
              Smart Hub
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-purple-200 hover:bg-purple-500/20 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="flex justify-between items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300/60" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-purple-950/50 text-purple-100 border-purple-700/30 placeholder-purple-400 focus:border-purple-500/50 focus:bg-purple-950/70 transition-colors"
            />
          </div>
          <div>
            <UserProfileDialog />
          </div>
        </div>
      </div>

      {/* User List Tabs */}
      <div className="flex-1 overflow-y-auto mt-2">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="sticky top-0 z-10 grid w-full grid-cols-3 p-1 bg-purple-900/50 backdrop-blur-md border-b border-purple-700/30">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-purple-600/30 text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="online"
              className="data-[state=active]:bg-purple-600/30 text-white"
            >
              Online
            </TabsTrigger>
            <TabsTrigger
              value="offline"
              className="data-[state=active]:bg-purple-600/30 text-white"
            >
              Offline
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="all" className="p-3 pt-2">
            {filteredUsers.map((user) => (
              <UserListChild
                key={user.id}
                user={user}
                selectedUser={selectedUser}
                handleSelect={handleSelect}
                isOnline={onlineUsersSet.has(user.id)}
              />
            ))}
          </TabsContent>
          <TabsContent value="online" className="p-3 pt-2">
            {filteredUsers
              .filter((user) => onlineUsersSet.has(user.id))
              .map((user) => (
                <UserListChild
                  key={user.id}
                  user={user}
                  selectedUser={selectedUser}
                  isOnline={true}
                  handleSelect={handleSelect}
                />
              ))}
          </TabsContent>
          <TabsContent value="offline" className="p-3 pt-2">
            {filteredUsers
              .filter((user) => !onlineUsersSet.has(user.id))
              .map((user) => (
                <UserListChild
                  key={user.id}
                  user={user}
                  selectedUser={selectedUser}
                  isOnline={false}
                  handleSelect={handleSelect}
                />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default SideBarContent;
