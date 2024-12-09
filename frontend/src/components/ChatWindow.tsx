import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  id: string;
  content: string | React.JSX.Element;
  sender: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Show loading when last message is from user
    setIsLoading(messages.length > 0 && messages[messages.length - 1].isOwn);
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
      {messages.map((message, index) => (
        <div
          key={message.id}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <ChatMessage
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
            isOwn={message.isOwn}
          />
        </div>
      ))}
      {isLoading && (
        <div className="flex items-center space-x-2 p-4">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
