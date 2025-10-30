import { useState } from "react";
import { Message, User } from "@/types/chat";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "../ui/avatar";

type MessageBubbleProps = {
  message: Message;
  isMyMessage: boolean;
  senderName: string;
  selectedUser: User | null;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
};

const TRUNCATE_LENGTH = 240;

const MessageBubble = ({
  message,
  isMyMessage,
  senderName,
  selectedUser,
  showLoadMore = false,
  onLoadMore,
}: MessageBubbleProps) => {
  const [expanded, setExpanded] = useState(false);

  const text = message.text || "";
  const isLong = text.length > TRUNCATE_LENGTH;
  const preview = isLong ? text.slice(0, TRUNCATE_LENGTH).trimEnd() + "…" : text;

  return (
    <div className={`flex mb-4 ${isMyMessage ? "justify-end" : "justify-start"}`}>
      <div className="w-full max-w-[95%]">
        {showLoadMore && onLoadMore && (
          <div className="flex justify-center mb-3">
            <button
              onClick={onLoadMore}
              className="px-3 py-1 rounded-full text-sm bg-gray-800/40 border border-purple-600/20 text-white hover:bg-gray-800/60 transition"
            >
              Load earlier messages
            </button>
          </div>
        )}

        {!isMyMessage ? (
          <div className="flex items-start gap-3">
            <Avatar className="shrink-0 mt-1">
              <AvatarImage
                src={selectedUser?.avatar_url || ""}
                alt={senderName}
                className="w-10 h-10 rounded-full"
              />
            </Avatar>

            <div className="max-w-[70%]">
              <div className="text-xs text-gray-400 mb-1">{senderName}</div>
              <div className="p-3 rounded-2xl bg-gray-900/50 border border-purple-600/10 text-gray-100 backdrop-blur-sm shadow-sm">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {expanded ? text : preview}
                </p>

                {isLong && (
                  <button
                    onClick={() => setExpanded((s) => !s)}
                    className="mt-2 text-sm text-indigo-300 hover:underline"
                    aria-expanded={expanded}
                  >
                    {expanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Outgoing message (right) */
          <div className="flex items-end justify-end">
            <div className="max-w-[70%]">
              <div className="p-3 rounded-2xl bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-md">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {expanded ? text : preview}
                </p>

                {isLong && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setExpanded((s) => !s)}
                      className="mt-2 text-sm text-white/90 hover:underline"
                      aria-expanded={expanded}
                    >
                      {expanded ? "Show less" : "Read more"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
