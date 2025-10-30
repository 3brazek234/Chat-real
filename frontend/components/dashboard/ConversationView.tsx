"use client";
import { useRef, useEffect, useState } from "react";
import { Message, User } from "@/types/chat";
import { useAuth } from "@/context/useAuth";
import { toast } from "react-hot-toast";

import { chatSocket } from "@/services/chatSocket";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { EmptyConversation } from "./EmptyConversation";
import MessageBubble from "./MessageBubble";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";

interface ConversationViewProps {
  selectedUser: User | null;
  setInsightsVisible: (visible: boolean) => void;
  showInsights: boolean;
}

const ConversationView = ({
  selectedUser,
  setInsightsVisible,
  showInsights,
}: ConversationViewProps) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");

    if (!storedToken) {
      console.error("No JWT token found, cannot authenticate.");
    } else {
      setToken(storedToken);
    }
  }, []);
  useEffect(() => {
    if (!token) {
      toast.error("No JWT token found, cannot authenticate.");
      return;
    }

    chatSocket.initialize(token);
    const handleAuthSuccess = (data: { userId: number; username: string }) => {
      setCurrentUserId(data.userId);
      setCurrentUserName(data.username);
    };

    chatSocket.onAuthSuccess(handleAuthSuccess);
    chatSocket.onAuthFailure((data) => {
      console.error("Authentication failed:", data.message);
      toast.error("Failed to authenticate");
    });

    // Cleanup on unmount
    return () => {
      chatSocket.disconnect();
    };
  }, [token, user?.id]);

  useEffect(() => {
    if (!currentUserId) return;
    if (!token) {
      toast.error("No JWT token found, cannot authenticate.");
      return;
    }
    const handleNewMessages = (response: {
      success: boolean;
      data: Message[];
    }) => {
      if (response.success) {
        setMessages(response.data);
      }
    };
    const handleChatMessage = (response: {
      success: boolean;
      data: Message;
    }) => {
      if (response.success) {
        const newMsg = response.data;
        console.log("Received new chat message:", newMsg);
        setMessages((prevMessages) => [...prevMessages, newMsg]);
      } else {
        toast.error("Received chat message error");
      }
    };
    chatSocket.onPrivateMessages(handleNewMessages);
    chatSocket.onPrivateMessagesError((data) => {
      console.error("Error fetching messages:", data.message);
      toast.error("Failed to load messages");
    });
    chatSocket.onChatMessage(handleChatMessage);
    if (selectedUser) {
      chatSocket.requestPrivateMessages(selectedUser.id);
    }

    return () => {
      chatSocket.removeAllListeners();
    };
  }, [selectedUser?.id, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() && currentUserId && selectedUser) {
      const sent = chatSocket.sendMessage(inputText.trim(), selectedUser.id);
      if (sent) {
        setInputText("");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    }
  };

  if (!selectedUser) {
    return <EmptyConversation />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black/80 text-white">
      <div className="z-10 bg-gray-800 border-b border-gray-700 flex items-center px-4">
        <div className="flex items-center gap-2">
          <ChatHeader user={selectedUser} />
        </div>
        <div className="ml-auto">
          <Button
            size="sm"
            onClick={() => setInsightsVisible(!showInsights)}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            AI Insights
          </Button>{" "}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto min-h-0 bg-transparent scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">
            No messages yet. Start a conversation!
          </p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              selectedUser={selectedUser}
              key={msg.id}
              message={msg}
              isMyMessage={msg.sender_id === currentUserId}
              senderName={msg.sender_name}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="z-10 bg-gray-950/80 backdrop-blur-sm border-t border-purple-800/50">
        <MessageInput
          value={inputText}
          onChange={setInputText}
          onSend={handleSendMessage}
          placeholder={`Type your message to ${selectedUser.name}...`}
          disabled={!chatSocket.isConnected() || !currentUserId}
        />
      </div>
    </div>
  );
};

export default ConversationView;
