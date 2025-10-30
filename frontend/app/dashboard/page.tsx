"use client";
import { useState, useEffect } from "react";
import UserList from "@/components/dashboard/UserList";
import ConversationView from "@/components/dashboard/ConversationView";
import AIInsightsPanel from "@/components/dashboard/AIInsightsPanel";
import { Message, User } from "@/types/chat";
import { useRouter } from "next/navigation";
import { chatSocket } from "@/services/chatSocket";
import { Button } from "@/components/ui/button"; // Import Button
import { Menu } from "lucide-react"; // Import Menu
import toast from "react-hot-toast";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const fetchConversation = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push("/");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data.data || []);
      if (!response.ok) {
        toast.error("Error fetching users:", data.message);
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Fetch users error:");
    }
  };

  useEffect(() => {
    chatSocket.onOnlineUsers(setOnlineUsers);
    fetchConversation();
  }, []);


  return (
    <div className="min-h-screen flex bg-gradient-to-r from-gray-900 via-purple-900 to-black text-white">
      {/* 2. Mobile Menu Button (Hamburger) */}
      <Button
        className="block md:hidden fixed top-4 left-4 z-50     
                   rounded-full                  
                   bg-gray-950/50                
                   backdrop-blur-md              
                   border border-white/10        
                   text-gray-300                 
                   shadow-lg                     
                   hover:bg-gray-800/60 
                   hover:text-white 
                 "
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <UserList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        onlineUsers={onlineUsers}
        open={open}
        setOpen={setOpen}
      />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 flex md:pl-80">
          <div className="flex-1 flex flex-col">
            <ConversationView
              selectedUser={selectedUser}
              setInsightsVisible={setShowInsights}
              showInsights={showInsights}
            />
          </div>

          {showInsights && selectedUser && (
            <div className="w-full md:w-96 border-l border-purple-600/20 bg-gray-950/70 backdrop-blur-xl flex-shrink-0">
              <AIInsightsPanel
                conversationId={selectedUser.id}
                onClose={() => setShowInsights(false)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
