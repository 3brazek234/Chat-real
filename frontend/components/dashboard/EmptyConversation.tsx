import { MessageSquare } from "lucide-react";

export const EmptyConversation = () => (
  <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black/80 text-center p-6 rounded-lg">
    <div className="text-center">
      <MessageSquare className="h-16 w-16 text-purple-400 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-white mb-2">
        Select a conversation
      </h2>
      <p className="text-gray-400">
        Choose a user from the sidebar to start chatting
      </p>
    </div>
  </div>
);