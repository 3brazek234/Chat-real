export interface User {
  id: string;
  name: string;
  last_message_text: string;
  email: string;
  avatar_url: string;
  partner_avatar: string;
  last_message_timestamp: Date;
}
export interface OnlineUser {
  id: string;
  name: string;
}
export interface Message {
  id: number;
  receiver_id: number;
  receiver_name: string;
  sender_id: number;
  sender_name: string;
  text: string;
  timestamp: Date;
}
export interface Insights {
  summary: string;
  sentiment: string;
  tags: string[];
}

export interface AIInsights {
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  tags: string[];
}
