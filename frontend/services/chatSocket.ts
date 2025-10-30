import { io, Socket } from "socket.io-client";
import { Message, OnlineUser } from "@/types/chat";

// Minimal shape for socket responses used by this service
interface SocketResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
interface AuthResponse {
    userId: number;
    username: string;
}
class ChatSocketService {
  private static instance: ChatSocketService;
  private socket: Socket | null = null;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): ChatSocketService {
    if (!ChatSocketService.instance) {
      ChatSocketService.instance = new ChatSocketService();
    }
    return ChatSocketService.instance;
  }

  initialize(token: string) {
    this.token = token;
    if (!this.socket) {
      this.socket = io("http://localhost:3001");
      this.setupBaseHandlers();
    }
    return this.socket;
  }

  private setupBaseHandlers() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      if (this.token) {
        this.socket?.emit("authenticate", this.token);
      }
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("error", (error: unknown) => {
      console.error("Socket error:", error);
    });
  }

  // Authentication handlers
  onAuthSuccess(callback: (data: AuthResponse) => void) {
    this.socket?.on("auth_success", callback);
    
  }

  onAuthFailure(callback: (data: { message: string }) => void) {
    this.socket?.on("auth_failure", callback);
  }

  // Message handlers
  requestPrivateMessages(userId: string) {
    if (this.socket?.connected) {
      this.socket.emit("request_private_messages", userId);
    }
  }

  onPrivateMessages(callback: (response: SocketResponse<Message[]>) => void) {
    this.socket?.on("private_messages", callback);
  }

  onPrivateMessagesError(callback: (data: { message: string }) => void) {
    this.socket?.on("private_messages_error", callback);
  }
  onOnlineUsers(callback: (onlineUsers: OnlineUser[]) => void) {
    this.socket?.on("online_users", callback);
  }
  onChatMessage(callback: (response: SocketResponse<Message>) => void) {
    this.socket?.on("chat message", callback);
  }

  sendMessage(text: string, receiverId: string) {
    if (this.socket?.connected) {
      this.socket.emit("chat message", {
        text,
        receiver_id: receiverId,
      });
      return true;
    }
    return false;
  }

  // Cleanup
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.setupBaseHandlers();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const chatSocket = ChatSocketService.getInstance();