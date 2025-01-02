import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import ChatWindow from "./components/ChatPage/ChatWindow";
import ChatInput from "./components/ChatPage/ChatInput";
import { LANGUAGES } from "./constants/LANGUAGES";

interface Message {
  id: string;
  content: string | React.JSX.Element;
  sender: string;
  timestamp: string;
  isOwn: boolean;
}

const ChatPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [isText, setIsText] = useState(null);
  const chatId = useRef<string | null>(null);
  const [caseId, setCaseId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (
    message: string,
    questionId: any,
    answerId: any
  ) => {
    setIsLoading(true);
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
      playerId: 445566,
      chatId: chatId.current,
      languageId: 1,
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
    return data.options.filter((item: any) => types.includes(item.contentType));
  };

  const renderQuestion = (data: any) => {
    const messages = filterMessages(data, ["Question"]);
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
              handleSendMessage(option.content, ques.id, option.id)
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

      if (data?.chatId) {
        chatId.current = data.chatId;
        setCaseId(data.chatId);
      }

      const text =
        data.options.length === 1 ? filterMessages(data, ["Question"]) : [];
      if (text.length > 0) {
        setIsText(text[0].id);
      }

      let content: any;
      content = [renderQuestion(data), renderOptions(data)];
      if (data.options.length === 0) {
        content = t("thankYou");
        chatId.current = null;
        setIsFirstMessage(true);
      }

      if (isText) {
        content = t("caseCreated", { caseId: caseId });
        setIsFirstMessage(true);
        chatId.current = null;
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
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    }
  };

  const navigateToQAContentGrid = () => {
    window.location.href = "/qa-content-grid"; // or use React Router
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-blue-200">
      <div className="w-full max-w-7xl h-[96vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden relative">
        {/* Sidebar with Bot Info */}
        {/* <div className="hidden w-1/3 bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 md:flex flex-col justify-center items-center">
          <div className="">
            <img
              src="/atvilogo-wht.png"
              alt="Activision Logo"
              className="h-30 w-auto opacity-80"
            />
          </div>
          <p className="text-center text-blue-100 ">{t("welcome")}</p>
          <button
            className="mt-8 bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => navigateToQAContentGrid()}
          >
            Q/A Content Grid
          </button>
        </div> */}

        {/* Chat Area */}
        <div className="w-full flex flex-col">
          {/* Chat Header with Language Selector */}
          <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src="https://img.freepik.com/free-vector/cartoon-style-robot-vectorart_78370-4103.jpg"
                  alt="Bot Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t("chatHeader")}</h3>
                <p className="text-sm text-gray-500">{t("online")}</p>
              </div>
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md shadow-sm hover:bg-gray-50 transition"
              >
                <span className="pr-3">
                  {
                    LANGUAGES.find((lang) => lang.code === currentLanguage)
                      ?.flag
                  }
                </span>
                {LANGUAGES.find((lang) => lang.code === currentLanguage)?.name}
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${currentLanguage === language.code ? "bg-gray-100" : ""
                        }`}
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Existing Chat Components */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatWindow messages={messages} />
          </div>
          <div className="border-t border-gray-200">
            <ChatInput onSendMessage={(message: string) => handleSendMessage(message, null, null)} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
