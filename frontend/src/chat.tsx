import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

interface Message {
  id: string;
  content: string | React.JSX.Element;
  sender: string;
  timestamp: string;
  isOwn: boolean;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [isText, setIsText] = useState();
  const handleSendMessage = async (
    message: string,
    questionId: any,
    answerId: any,
    isBegin: string
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const request = {
      userId: "test6",
      isChatBegin: isBegin ? false : isFirstMessage,
      questionId: isText ? isText : questionId,
      answerId,
      description: isText ? message : null,
    };

    if (isFirstMessage) {
      setIsFirstMessage(false);
    }

    getResponse(request);
  };

  const filterMessages = (data: any, types: string[]) => {
    return data.filter((item: any) => types.includes(item.contentType));
  };

  const renderQuestion = (data: any) => {
    const messages = filterMessages(data, ["Question", "Text"]);
    return messages.map((message: any) => (
      <p key={message.id}>{message.content}</p>
    ));
  };

  const renderOptions = (data: any) => {
    const options = filterMessages(data, ["Answer"]);
    const ques = filterMessages(data, ["Question"])[0];
    console.log(options, "options");
    console.log(ques, "ques");

    return (
      <div className="flex py-2 gap-5">
        {options.map((option: any) => (
          <div
            key={option.id}
            className="text-blue-600 border border-blue-200 p-3 rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-300 cursor-pointer text-sm font-medium"
            onClick={() =>
              handleSendMessage(option.content, ques.id, option.id, "false")
            }
          >
            {option.content}
          </div>
        ))}
      </div>
    );
  };

  const getResponse = async (request: any) => {
    setIsText(null);
    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const data = await response.json();

      const text = filterMessages(data, ["Text"]);
      if (text.length > 0) setIsText(text[0].id);
      const message = filterMessages(data, ["Message"]);
      let content: any;
      if (message.length > 0) {
        content = message[0].content;
      } else {
        content = [renderQuestion(data), renderOptions(data)];
      }

      if (data.length === 0) {
        content = "Thank you for contacting us. We will get back to you soon.";
        setIsFirstMessage(true);
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: "Support Bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: false,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-xl flex flex-col">
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Support Chat</h2>
              <p className="text-sm text-blue-100">
                We typically reply within minutes
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatWindow messages={messages} />
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={!isFirstMessage && !isText}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
