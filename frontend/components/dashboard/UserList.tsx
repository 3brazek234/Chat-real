"use client";
import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { OnlineUser, User } from "@/types/chat";
import SidebarContent from "./SideBarContent";

interface UserListProps {
  selectedUser: User | null;
  onSelectUser: (user: User | null) => void;
  users: User[];
  onlineUsers: OnlineUser[];
  setOpen: (open: boolean) => void;
  open: boolean;
}

const UserList = ({
  users,
  selectedUser,
  onSelectUser,
  onlineUsers,
  open,
  setOpen,
}: UserListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const onlineUsersSet = new Set(onlineUsers.map((u: OnlineUser) => u.id));

  const handleSelect = (user: User | null) => {
    onSelectUser(user);
    setOpen(false);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handler = () => setOpen(false);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [setOpen]); 

  return (
    <>
      <div className="hidden md:block w-80 flex-shrink-0 fixed h-full border-r border-purple-600/20">
        <SidebarContent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSelect={handleSelect}
          filteredUsers={filteredUsers}
          selectedUser={selectedUser}
          onlineUsersSet={onlineUsersSet}
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-80 p-0 bg-purple-900/95 backdrop-blur-md border-purple-700/50"
        >
          <SidebarContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSelect={handleSelect}
            filteredUsers={filteredUsers}
            selectedUser={selectedUser}
            onlineUsersSet={onlineUsersSet}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UserList;
