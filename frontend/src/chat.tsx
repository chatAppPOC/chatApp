import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import ChatWindow from "./components/ChatPage/ChatWindow";
import ChatInput from "./components/ChatPage/ChatInput";
import { LANGUAGES } from "./constants/LANGUAGES";
import { timeStamp } from "console";
import { generateBasicAuthHeader } from "./utils/basicAuth";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import PushNotification from "./pushNotification/PushNotification";
import {
  getCaseById,
  getChatHistoryByChatId,
  getFeedbackByCaseId,
  getFeedbackByChatId,
  getPlayerChatHistory,
  getPlayerContent,
  saveHistory,
} from "./api";
import { format } from "date-fns";
import { toast } from "sonner";
import { VscLoading } from "react-icons/vsc";
import AlertMessage from "./components/AlertError";
import { Button } from "./components/ui/button";
import { CaseStatus } from "./constants/enum";
import { Card } from "./components/ui/card";

interface Message {
  id: string;
  content: string | React.JSX.Element;
  sender: string;
  timestamp: string;
  isOwn: boolean;
}

enum ChatStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETE = "COMPLETE",
  CASE_CREATED = "CASE_CREATED",
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
  const [isNewChat, setIsNewChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [playerContent, setPlayerContent] = useState<any | null>(null);
  const [waitingForDescription, setWaitingForDescription] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const feebackDefaultData = {
    show: false,
    name: "",
    id: "",
  };
  const [showFeedbackPopup, setShowFeedbackPopup] =
    useState(feebackDefaultData);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isFeedbackSubmited, setIsFeedBackSubmitted] = useState(false);

  const navigate = useNavigate();
  const playerId = Number(localStorage.getItem("id"));
  // const chatId = Number(localStorage.getItem("chatId"));
  const [chatId, setChatId] = useState<number | null>();

  // const allMessages = messages.concat(chatHistory);

  const [globalError, setGlobalError] = useState(false);

  const fetPlayerContent = async () => {
    try {
      const response = await getPlayerContent(playerId);
      setPlayerContent(response);
      setCurrentQuestion(response.content.questionare.questions);
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Error fetching player content"
      );
      setGlobalError(true);
      console.error("Error fetching player content:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await getPlayerChatHistory(playerId);
      const his: Message[] = [];
      data.forEach((i: any) => {
        i?.messages.forEach((j: any) => {
          his.push({
            id: j?.timestamp,
            content: j?.content,
            sender: j?.source,
            timestamp: j?.timestamp,
            isOwn: j?.source === "PLAYER",
          });
        });
      });
      console.log("messagesFromHistory:", his);
      setMessages(his);
      const mess = data.sort((a: any, b: any) => a.id - b.id);
      let lastChat =
        mess.find((item: any) => item?.id == localStorage.getItem("chatId")) ||
        mess[mess.length - 1];
      console.log("lastChat:", lastChat);
      if (lastChat?.status == ChatStatus.IN_PROGRESS) {
        setChatId(lastChat?.id);
        localStorage.setItem("chatId", lastChat?.id.toString());
        setShowContinuePrompt(true);
        setDisableChatInput(true);
        return;
      }

      if (lastChat?.id) {
        setChatId(lastChat.id);
      }

      if (lastChat?.status == ChatStatus.COMPLETE) {
        try {
          const feedbackByChat = await getFeedbackByChatId(lastChat.id);
        } catch (error: any) {
          console.error("Error fetching case feedback:", error);
          if (error?.response?.data?.status === 404) {
            setShowFeedbackPopup({
              show: true,
              name: "chatId",
              id: lastChat.id,
            });
          }
          return;
        }
      }

      if (lastChat?.status == ChatStatus.CASE_CREATED) {
        let localCaseId = null;
        const botMessages = lastChat.messages.filter(
          (msg: any) => msg.source === "BOT"
        );
        if (botMessages.length > 0) {
          const lastBotMessage = botMessages[botMessages.length - 1]; // Get the last bot message
          const match = lastBotMessage?.content?.match(/ID\s*:\s*(\d+)/); // Extract numeric case ID
          if (match) {
            localCaseId = match[1]; // Extract the ID part
          }
        }

        const caseDetails = await getCaseById(localCaseId);

        if (caseDetails?.status == CaseStatus.RESOLVED) {
          try {
            const caseFeedBackDetails = await getFeedbackByCaseId(localCaseId);
            if (!caseFeedBackDetails?.issueResolved) {
              setShowFeedbackPopup({
                show: true,
                name: "caseId",
                id: localCaseId,
              });
            }
            return;
          } catch (error: any) {
            console.error("Error fetching case feedback:", error);
            if (error?.response?.data?.status === 404) {
              setShowFeedbackPopup({
                show: true,
                name: "caseId",
                id: localCaseId,
              });
            }
            return;
          }
        }
      }

      setShowFeedbackPopup(feebackDefaultData);
    } catch (error) {
      console.error("Error fetching player content:", error);
    }
  };
  const saveChat = async (msg: any) => {
    try {
      const res = await saveHistory(msg);
      console.log("save Chat response:", res);
      if (res?.chatId && res?.chatId !== chatId) {
        localStorage.setItem("chatId", res.chatId.toString());
        setChatId(res.chatId);
      }
      return res;
    } catch (error) {
      console.error("Failed to save history:", error);
      toast.error("Failed to save history");
    }
  };

  useEffect(() => {
    fetPlayerContent();
    fetchHistory();
  }, []);

  const handleCancelChat = async (): Promise<void> => {
    const res = await saveChat({
      message: {
        content: "User cancelled the chat",
        source: "PLAYER",
        contentType: "Solution",
      },
      playerId: Number(localStorage.getItem("id")),
      chatId: localStorage.getItem("chatId"),
    });
    setMessages([]);
    setShowContinuePrompt(false);
    setDisableChatInput(false);
  };

  const getOptions = (answers: any) => {
    return (
      <div className="flex gap-2 flex-col">
        {answers.map((ans: any) => {
          return (
            <div
              className="cursor-pointer border p-2 text-sm rounded-md shadow-sm hover:shadow-md hover:bg-accent "
              onClick={() =>
                handleSendMessage(
                  ans.answer,
                  ans.questions,
                  ans.solution || null,
                  !ans.solution && !ans.questions?.answers
                )
              }
            >
              {ans.answer}
            </div>
          );
        })}
      </div>
    );
  };

  const handleContinueChat = async (): Promise<void> => {
    const lastMessage = messages[messages.length - 1]?.content as string;
    console.log("lastMessage:", lastMessage, currentQuestion);

    const findMatchingObject = (
      questions: any,
      targetQuestion: string
    ): any => {
      if (!questions) return null;

      if (questions.question === targetQuestion) {
        return questions;
      }

      if (questions.answers) {
        for (const answer of questions.answers) {
          if (answer.questions) {
            const result = findMatchingObject(answer.questions, targetQuestion);
            if (result) return result;
          }
        }
      }
      return null;
    };

    const matchedObject = findMatchingObject(currentQuestion, lastMessage);
    console.log("matchedObject", matchedObject);

    if (matchedObject) {
      if (matchedObject.answers) {
        setMessages((prevMessages) => [
          ...prevMessages,
          getMessage(getOptions(matchedObject.answers), true),
        ]);
        setDisableChatInput(true);
      } else {
        setDisableChatInput(false);
      }
      setCurrentQuestion(matchedObject);
      setIsNewChat(false);
      setShowContinuePrompt(false);
    }
  };

  const handleFeedbackRedirect = async () => {
    navigate(`/feedback?${showFeedbackPopup.name}=${showFeedbackPopup.id}`);
  };

  const getMessage = (message: any, isBot: boolean) => {
    return {
      id: Date.now().toString(),
      content: message,
      sender: isBot ? "BOT" : "PLAYER",
      timestamp: format(new Date(), "dd/MMM/yyyy hh:mm:ss a"),
      isOwn: isBot ? false : true,
    };
  };

  const resetChat = () => {
    setIsNewChat(true);
    setDisableChatInput(false);
    setChatId(null);
    setCurrentQuestion(playerContent.content.questionare.questions);
    localStorage.removeItem("chatId");
  };

  async function handleSendMessage(
    message: string,
    nextSetOfQuestions: any = null,
    solution: any = null,
    isDes: boolean = false
  ): Promise<void> {
    setIsLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      getMessage(message, false),
    ]);
    setIsLoading(false);
    setShowFeedbackPopup(feebackDefaultData);
    const res = await saveChat({
      message: { content: message, source: "PLAYER" },
      playerId: Number(localStorage.getItem("id")),
      chatId: localStorage.getItem("chatId") || undefined,
    });

    const apiChatId = res?.chatId;

    if (solution) {
      const res = await saveChat({
        message: { content: solution, source: "BOT", contentType: "Solution" },
        playerId: Number(localStorage.getItem("id")),
        chatId: apiChatId,
      });

      // Update the messages with the question and answer
      setMessages((prevMessages) => [
        ...prevMessages,
        getMessage(solution, true),
        getMessage(res.message, true),
      ]);

      if (res.message) {
        setShowFeedbackPopup({ show: true, name: "chatId", id: apiChatId });
        resetChat();
      }
      return;
    }

    if (!solution && !nextSetOfQuestions?.answers && !isNewChat) {
      const res = await saveChat({
        message: {
          content: message,
          source: "BOT",
          contentType: "Description",
        },
        playerId: Number(localStorage.getItem("id")),
        chatId: apiChatId,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        getMessage(res.message, true),
      ]);

      resetChat();
      return;
    }

    const curr = nextSetOfQuestions || currentQuestion;

    await saveChat({
      message: { content: curr.question, source: "BOT" },
      playerId: Number(localStorage.getItem("id")),
      chatId: apiChatId,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      getMessage(curr.question, true),
    ]);

    if (curr.answers) {
      setMessages((prevMessages) => [
        ...prevMessages,
        getMessage(getOptions(curr.answers), true),
      ]);
    }
    if (isDes) {
      setDisableChatInput(false);
    } else {
      setDisableChatInput(true);
    }
    setIsNewChat(false);
    setIsLoading(false);
  }

  if (isLoadingContent) {
    return (
      <div className="grid place-content-center h-screen w-screen">
        <VscLoading className="animate-spin  text-blue-500 text-5xl" />
      </div>
    );
  }

  if (globalError) {
    return (
      <div className="h-full my-20 space-y-4">
        <AlertMessage title="Error" type="destructive">
          Failed to Load chat data. Please try again later.
        </AlertMessage>
        <Button onClick={() => window.location.reload()} variant="destructive">
          Reload
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center   overflow-hidden">
      <div className="w-full max-w-3xl h-[92vh] border bg-white  flex overflow-hidden relative">
        {/* Chat Area */}
        <div className="w-full flex flex-col relative">
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
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                        currentLanguage === language.code ? "bg-gray-100" : ""
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
          <div className="absolute top-full left-0 w-full z-20 bg-white shadow-md ">
            <PushNotification />
          </div>

          {/* Existing Chat Components */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatWindow messages={messages} />
            {/* <ChatWindow messages={messages} /> */}
          </div>

          {/* Continue Chat Prompt */}
          {showContinuePrompt && (
            <div className="p-4 bg-gray-100 flex items-center justify-center">
              <p className="text-gray-700 mr-4">
                {t("Would you like to continue with your previous chat?")}
              </p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                onClick={handleContinueChat}
              >
                {t("Yes")}
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                onClick={handleCancelChat}
              >
                {t("No")}
              </button>
            </div>
          )}

          {/* Popup Modal for Chat Completion */}
          {showFeedbackPopup.show && (
            <div className="p-4 bg-gray-100 flex items-center justify-center">
              <p className="text-gray-700 mr-4">
                {t("Would you like to give feedback?")}
              </p>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={handleFeedbackRedirect}
              >
                {t("Give Feedback")}
              </button>
            </div>
          )}

          <div className="border-t border-gray-200">
            <ChatInput
              onSendMessage={(message: string) =>
                handleSendMessage(message, null, null, false)
              }
              disabled={isLoading || waitingForDescription || disableChatInput}
            />
            {/* Disable the input box when waiting for a solution or question  */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
