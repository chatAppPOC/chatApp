import React from "react";

interface ChatMessageProps {
  content: string | React.JSX.Element;
  sender: string;
  timestamp: string;
  isOwn: boolean;
  disabled?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  timestamp,
  isOwn,
  disabled = true,
}) => {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 px-4 ${
        !isOwn &&
        disabled &&
        "pointer-events-none cursor-not-allowed opacity-75"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 shadow-md transition-all duration-200 hover:shadow-lg ${
          isOwn
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none transform"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-none transform"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{sender}</span>
          <span
            className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-500"}`}
          >
            {timestamp}
          </span>
        </div>
        {typeof content === "string" ? (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        ) : (
          <div className={`flex flex-col gap-2 `}>{content}</div>
        )}
      </div>
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden mx-2 flex-shrink-0 shadow-md  ">
          <img
            src="https://img.freepik.com/free-vector/cartoon-style-robot-vectorart_78370-4103.jpg"
            alt="Bot"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
