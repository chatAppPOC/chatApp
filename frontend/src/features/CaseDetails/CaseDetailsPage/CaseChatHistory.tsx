import { getChatHistoryByChatId } from "@/api";
import AlertMessage from "@/components/AlertError";
import ChatMessage from "@/components/ChatPage/ChatMessage";
import ChatWindow from "@/components/ChatPage/ChatWindow";
import Loader from "@/components/Loader";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

type Props = {
  chatId: number;
};

const CaseChatHistory = (props: Props) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { chatId } = props;
  useEffect(() => {
    const fetchLatestCaseId = async () => {
      setIsLoading(true);
      try {
        const data = await getChatHistoryByChatId(chatId);
        const messagesFromHistory = await data.messages?.map((msg: any) => ({
          id: data?.id,
          playerId: data?.playerId ?? 0,
          content: msg?.content,
          description: data?.description ? data?.description?.toString() : "",
          sender: msg?.source,
          timestamp: msg?.timestamp,
          isOwn: msg?.source === "PLAYER",
        }));

        setMessages(messagesFromHistory);
      } catch (error) {
        console.error("Error fetching latest chat ID:", error);
      }
      setIsLoading(false);
    };

    if (chatId) {
      fetchLatestCaseId();
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!messages || messages.length === 0) {
    return <AlertMessage>No Chat History</AlertMessage>;
  }

  return (
    <Card className="max-w-3xl">
      <ChatWindow messages={messages} isHistory />
    </Card>
  );
};

export default CaseChatHistory;
