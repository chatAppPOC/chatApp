import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          disabled={disabled}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("chatInput.placeholder")}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 resize-none h-20"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">{t("chatInput.enterHint")}</p>
          <Button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 transition-colors text-sm font-semibold"
          >
            Send Message
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
