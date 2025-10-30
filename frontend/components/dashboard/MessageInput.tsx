import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput = ({
  value,
  onChange,
  onSend,
  placeholder,
  disabled = false,
}: MessageInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      onSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-700 bg-gradient-to-b from-black via-gray-900 to-black/80 flex items-center">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        disabled={disabled}
        onKeyPress={handleKeyPress}
      />
      <Button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="ml-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};