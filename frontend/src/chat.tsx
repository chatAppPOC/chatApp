import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import ChatWindow from "./components/ChatPage/ChatWindow";
import ChatInput from "./components/ChatPage/ChatInput";
import { LANGUAGES } from "./constants/LANGUAGES";
import { timeStamp } from "console";
import { generateBasicAuthHeader } from "./utils/basicAuth";
import { useLocation, useParams } from "react-router-dom";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import PushNotification from "./pushNotification/PushNotification";

interface Message {
  id: string;
  content: string | React.JSX.Element;
  sender: string;
  timestamp: string;
  isOwn: boolean;
}

type ChatRequest = {
  playerId: number;
  chatId?: number;
  message: {
    content: string;
    source: "PLAYER" | "BOT";
    contentType?: "Description";
  };
};

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
  const [isText, setIsText] = useState<string | null>(null);
  const chatId = useRef<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [createContentId, setCreateContentId] = useState(false);

  const [questionnaire, setQuestionnaire] = useState<any | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [waitingForDescription, setWaitingForDescription] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [latestChatId, setLatestChatId] = useState<number | null>(null);
  const [continueWithChat, setContinueWithChat] = useState(false);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const [notification, setNotifications] = useState([]);
  const [playerId, setPlayerId] = useState("");

  const isAdmin = localStorage.getItem("role");
  const chat = Number(localStorage.getItem("chatId")) ?? 0;

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const caseno = Number(localStorage.getItem("caseno"));
  const isUser = localStorage.getItem("role");
  const params = useParams();
  const isParams = params?.caseId ? true : false;

  console.log("isParams", isParams, params.caseId);

  useEffect(() => {
    const fetchLatestCaseId = async () => {
      if ((isUser === "USER" || isUser === "ADMIN") && isParams) {
        // Only user need to fetch the chat based on caseid
        try {
          // Fetch the latest chat ID from the backend
          const response = await fetch(
            `http://localhost:8080/api/case?caseId=${Number(params.caseId)}`,
            {
              method: "GET",
              headers: {
                ...generateBasicAuthHeader(),
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();

          const response1 = await fetch(
            `http://localhost:8080/api/v2/chat/${data[0]?.chatId}`,
            {
              method: "GET",
              headers: {
                ...generateBasicAuthHeader(),
                "Content-Type": "application/json",
              },
            }
          );
          setLatestChatId(data.chatId);
          const data1 = await response1.json();

          const messagesFromHistory = await data1.messages?.map((msg: any) => ({
            id: data?.id,
            playerId: data?.playerId ?? 0,
            content: msg?.content,
            description: data?.description ? data?.description?.toString() : "",
            sender: msg?.source,
            timestamp: msg?.timestamp,
            isOwn: msg?.source === "PLAYER",
          }));

          setMessages(messagesFromHistory);
          setLatestChatId(data.caseno); // Store the latest chat ID
          setDisableChatInput(true);
        } catch (error) {
          console.error("Error fetching latest chat ID:", error);
        }
      }
    };
    fetchLatestCaseId();
    // setWaitingForDescription(false);
  }, []);

  //  admin chat history
  useEffect(() => {
    const fetchLatestChatId = async () => {
      if (isUser === "ADMIN") {
        try {
          // Fetch the latest chat ID
          const chat = Number(localStorage.getItem("chatId")) || 0;
          const response = await fetch(
            `http://localhost:8080/api/v2/chat/${chat}`,
            {
              method: "GET",
              headers: {
                ...generateBasicAuthHeader(),
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch chat");
          const data = await response.json();

          setLatestChatId(data.chatId); // Store the latest chat ID
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
          setDisableChatInput(true);
        } catch (error) {
          console.error("Error fetching latest chat ID:", error);
        }
      }
    };

    fetchLatestChatId();
    setWaitingForDescription(true);
  }, [isAdmin]);

  const formatDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";

    return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  const id = Number(localStorage.getItem("id"));

  useEffect(() => {
    const fetchChatHistory = async (page: number) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/chat/history/${id}?page=0&size=300`,
          {
            method: "GET",
            headers: {
              ...generateBasicAuthHeader(),
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data?.length == 0) {
          setShowContinuePrompt(false);
          setWaitingForDescription(false);
        } else {
          const latestUpdatedOn = await data.reduce(
            (latest: any, current: any) => {
              return latest?.id > current?.id ? latest : current;
            }
          );

          const messagesFromHistory = await latestUpdatedOn?.messages?.map(
            (msg: any) => ({
              id: latestUpdatedOn?.id,
              playerId: latestUpdatedOn?.playerId ?? 0,
              content: msg?.content,
              description: latestUpdatedOn?.description
                ? latestUpdatedOn?.description?.toString()
                : "",
              sender: msg?.source,
              timestamp: msg?.timestamp,
              isOwn: msg?.source === "PLAYER",
            })
          );

          setMessages(messagesFromHistory);

          // Fetch the latest chat ID
          const response = await fetch(
            `http://localhost:8080/api/v2/chat/${chat}`,
            {
              method: "GET",
              headers: {
                ...generateBasicAuthHeader(),
                "Content-Type": "application/json",
              },
            }
          );
          const data2 = await response.json();
          setPlayerId(data2.playerId);
          // setLatestChatId(data.chatId); // Store the latest chat ID
          if (data2?.status === "CASE_CREATED" || data?.status === "COMPLETED") {
            setShowContinuePrompt(false);
            setWaitingForDescription(false);
          } else {
            setShowContinuePrompt(true);
          }
          // setWaitingForDescription(false);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatHistory(currentPage);
  }, [currentPage, id, latestChatId]);

  const handleContinueChat = async (shouldContinue: boolean) => {
    setIsLoading(true);
    try {
      setContinueWithChat(shouldContinue);
      if (shouldContinue) {
        const response = await fetch(
          `http://localhost:8080/api/chat/history/${id}?page=0&size=300`,
          {
            headers: {
              ...generateBasicAuthHeader(),
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data?.length > 0) {
          const latestUpdatedOn = data.reduce((latest: any, current: any) =>
            latest?.id > current?.id ? latest : current
          );

          const messagesFromHistory = latestUpdatedOn?.messages?.map(
            (msg: any) => ({
              id: latestUpdatedOn?.id,
              playerId: latestUpdatedOn?.playerId ?? 0,
              content: msg?.content,
              description: latestUpdatedOn?.description?.toString() || "",
              sender: msg?.source,
              timestamp: msg?.timestamp,
              isOwn: msg?.source === "PLAYER",
            })
          );

          localStorage.setItem("chatId", latestUpdatedOn?.id);
          setWaitingForDescription(false);

          const request: ChatRequest = {
            playerId: latestUpdatedOn?.playerId ?? 0,
            chatId: latestUpdatedOn?.id,
            message: {
              content:
                "This is the description given by the player in the desc box",
              source: "PLAYER",
              contentType: "Description",
            },
          };
        } else {
          setMessages([]);
          setCurrentPage(0);
          localStorage.removeItem("chatId");
          setWaitingForDescription(false);
        }
      } else {
        setMessages([]);
        setCurrentPage(0);
        localStorage.removeItem("chatId");
        setWaitingForDescription(false);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setShowContinuePrompt(false);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (
    message: string,
    questionId: any,
    answerId: any,
    isDescription: boolean
  ) => {
    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "You",
      timestamp: formatDate(),
      isOwn: true,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const chatIdValue = Number(localStorage.getItem("chatId"));

    if (isFirstMessage && !createContentId) {
      const request: ChatRequest = {
        playerId: Number(localStorage.getItem("id")) ?? 0,
        message: {
          content: message,
          source: "PLAYER",
          ...(createContentId === true ? { contentType: "Description" } : {}),
        },
        ...(continueWithChat ? { chatId: chatIdValue } : {}),
      };
      await getResponse(request);

      await setQuestionsResponse();
    } else if (createContentId) {
      const request: ChatRequest = {
        playerId: Number(localStorage.getItem("id")) ?? 0,
        message: {
          content: message,
          source: "PLAYER",
          ...(createContentId === true ? { contentType: "Description" } : {}),
        },
        ...(chatIdValue ? { chatId: chatIdValue } : {}),
      };
      await getResponse(request);
    }
  };

  const convertData = (input: any) => {
    const transformedData = JSON.parse(JSON.stringify(input));

    const transformQuestions = (questions: any) => {
      questions.forEach((q: any) => {
        if (q.questions) {
          if (q.questions.answers) {
            q.questions.answers.forEach((ans: any) => {
              if (ans.questions && ans.questions.answers) {
                ans.questions.answers.forEach((subAns: any) => {
                  if (subAns.questions && subAns.questions.answers === null) {
                    delete subAns.answers;
                  }
                });
              }
            });
          }

          if (!q.questions.answers) {
            if (q.questions.questions) {
              q.questions = {
                question: q.questions.question,
                answers: q.questions.questions,
              };
            }
          }

          transformQuestions(q.questions.answers);
        }
      });
    };

    transformQuestions(transformedData.questionare.questions.answers);

    return transformedData;
  };

  const getResponse = async (request: ChatRequest) => {
    setIsText(null);
    try {
      const response = await fetch("http://localhost:8080/api/v2/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...generateBasicAuthHeader(),
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (data?.chatId) {
        localStorage.setItem("chatId", data?.chatId);
        chatId.current = data.chatId;
        setCaseId(data.chatId);
      }
      const text = data?.options?.length === 1 ? data.options : [];
      if (text.length > 0) {
        setIsText(text[0].id);
      }

      let content: any = [
        renderQuestion(currentQuestion?.question),
        renderOptions(currentQuestion?.answers),
      ];
      if (data?.options?.length === 0) {
        content = t("thankYou");
        chatId.current = null;
        setIsFirstMessage(true);
      }

      if (isText) {
        content = t("caseCreated", { caseId: caseId });
        setIsFirstMessage(true);
        chatId.current = null;
      }
      // setDisableChatInput(true);

      // Fetch the latest chat ID
      const response1 = await fetch(
        `http://localhost:8080/api/v2/chat/${chat}`,
        {
          method: "GET",
          headers: {
            ...generateBasicAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      const data2 = await response1.json();
      // setLatestChatId(data.chatId); // Store the latest chat ID
      if (data2?.status === "IN_PROGRESS") {
        setShowContinuePrompt(false);
        setDisableChatInput(false);
      }

      const ticketMessage: any | null =
        data?.message !== ""
          ? {
              id: Date.now().toString(),
              content: data?.message,
              playerId: request?.playerId ?? 0,
              description: "",
              sender: "Support Bot",
              timestamp: formatDate(),
              isOwn: false,
            }
          : null;

      if (ticketMessage?.content) {
        await setMessages((prevMessages) => [
          ...prevMessages,
          { ...ticketMessage },
        ]);
      }

      const questionMessage: Message | null = content[0]?.trim()
        ? {
            id: Date.now().toString(),
            content: content[0],
            sender: "Support Bot",
            timestamp: formatDate(),
            isOwn: false,
          }
        : null;

      const answerMessage: Message | null = content[1]?.trim()
        ? {
            id: Date.now().toString(),
            content: content[1],
            sender: "Support Bot",
            timestamp: formatDate(),
            isOwn: false,
          }
        : null;

      const message: Message = {
        id: Date.now().toString(),
        content: `Support case has been created with ID :${data?.id}`,
        sender: "Support Bot",
        timestamp: formatDate(),
        isOwn: false,
      };

      const newMessages: Message[] = [];
      if (questionMessage) newMessages.push(questionMessage);
      if (answerMessage) newMessages.push(answerMessage);

      setMessages((prevMessages) => [...prevMessages, ...newMessages]);

      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    }
  };

  const setSendQuestion = async (message: string) => {
    const response = await fetch("http://localhost:8080/api/v2/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...generateBasicAuthHeader(),
      },
      body: JSON.stringify(request),
    });
  };

  // questions and answers
  const setQuestionsResponse = async () => {
    setIsText(null);
    try {
      const response = await fetch( 
        // `http://localhost:8080/api/v2/content?contentId=32`,
        `http://localhost:8080/api/v2/contents/player/${playerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...generateBasicAuthHeader(),
          },
        }
      );
      const data = await response.json();
      const questionnaireData = data.content.questionare;
      setQuestionnaire(questionnaireData);
      // Set the initial question if available

      if (questionnaireData.questions?.question) {
        setCurrentQuestion(questionnaireData.questions?.question); // Start with the first question
        await getResponse({
          message: {
            content: questionnaireData.questions?.question,
            source: "BOT",
          },
          playerId: Number(localStorage.getItem("id")) ?? 0,
          chatId: Number(localStorage.getItem("chatId")) ?? 0,
        });
      }
      setIsLoading(false);

      let content: any = [
        renderQuestion(questionnaireData.questions?.question),
        renderOptions(questionnaireData.questions?.answers),
      ];

      if (data?.options?.length === 0) {
        content = t("thankYou");
        chatId.current = null;
        setIsFirstMessage(true);
      }

      if (isText) {
        content = t("caseCreated", { caseId: caseId });
        setIsFirstMessage(true);
        chatId.current = null;
      }

      // Construct the question and answer messages
      const qestionMessage: Message = {
        id: Date.now().toString(),
        content: content[0],
        sender: "Support Bot",
        timestamp: formatDate(),
        isOwn: false,
      };

      const answerMessage: Message = {
        id: Date.now().toString(),
        content: content[1],
        sender: "Support Bot",
        timestamp: formatDate(),
        isOwn: false,
      };
      const message: Message = {
        id: Date.now().toString(),
        content: `Support case has been created with ID :${data?.id}`,
        sender: "Support Bot",
        timestamp: formatDate(),
        isOwn: false,
      };

      // Update the messages with the question and answer
      setMessages((prevMessages) => [
        ...prevMessages,
        qestionMessage,
        answerMessage,
      ]);

      setIsLoading(false);

      return data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    }
  };

  const renderQuestion = (question: string) => {
    return <p>{question}</p>; // Render the question text
  };

  const renderOptions = (answers: Array<any>) => {
    return answers?.map((answer, index) => {
      return (
        <button key={index} onClick={() => handleAnswerClick(answer)}>
          {answer.answer}
        </button>
      );
    });
  };

  const handleAnswerClick = async (answer: any) => {
    if (!answer) {
      return;
    }

    const selectedMessage: Message = {
      id: Date.now().toString(),
      content: answer.answer,
      sender: "You",
      timestamp: formatDate(),
      isOwn: true,
    };

    setMessages((prevMessages) => [...prevMessages, selectedMessage]);

    // await getResponse({message:{content:answer.answer??"",source:"PLAYER"},playerId:Number(localStorage.getItem("id"))??0,chatId:Number(localStorage.getItem("chatId"))??0})
    if (answer.answer) {
      await getResponse({
        message: { content: answer.answer ?? "", source: "PLAYER" },
        playerId: Number(localStorage.getItem("id")) ?? 0,
        chatId: Number(localStorage.getItem("chatId")) ?? 0,
      });
    }
    if (answer.solution) {
      const solutionMessage: Message = {
        id: Date.now().toString(),
        content: answer.solution,
        sender: "Support Bot",
        timestamp: formatDate(),
        isOwn: false,
      };

      const thankYouMessage: Message = {
        id: Date.now().toString(),
        content: t("thankYou"),
        sender: "Support Bot",
        timestamp: formatDate(),
        isOwn: false,
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        solutionMessage,
        thankYouMessage,
      ]);
      await getResponse({
        message: { content: answer.solution, source: "BOT" },
        playerId: Number(localStorage.getItem("id")) ?? 0,
        chatId: Number(localStorage.getItem("chatId")) ?? 0,
      }).then(async () => {
        await getResponse({
          message: { content: t("thankYou"), source: "BOT" },
          playerId: Number(localStorage.getItem("id")) ?? 0,
          chatId: Number(localStorage.getItem("chatId")) ?? 0,
        });
      });

      // Disable input after showing solution
      setWaitingForDescription(false); // Disable input // true
      if (answer.questions.answers === null) {
        setCreateContentId(true);
        return setWaitingForDescription(false);
      }
      setWaitingForDescription(true);
    } else if (answer.questions) {
      const nextQuestion = answer.questions;
      if (nextQuestion) {
        if (nextQuestion?.question) {
          await getResponse({
            message: { content: nextQuestion?.question, source: "BOT" },
            playerId: Number(localStorage.getItem("id")) ?? 0,
            chatId: Number(localStorage.getItem("chatId")) ?? 0,
          });
        }
        setCurrentQuestion(nextQuestion);
        setSendQuestion(nextQuestion.question);
        setMessages((prevMessages: any) => [
          ...prevMessages,
          {
            id: Date.now().toString(),
            content: renderQuestion(nextQuestion.question),
            sender: "Support Bot",
            timestamp: formatDate(),
            isOwn: false,
          },
          ...(nextQuestion.answers?.length
            ? [
                {
                  id: Date.now().toString(),
                  content: renderOptions(nextQuestion.answers),
                  sender: "Support Bot",
                  timestamp: formatDate(),
                  isOwn: false,
                },
              ]
            : []),
        ]);

        // Disable input unless it requires a description
        if (answer.questions.answers === null) {
          setCreateContentId(true);
          return setWaitingForDescription(false);
        }
        setWaitingForDescription(true); //false
      }
    } else if (answer.description) {
      // Enable input for describing an issue
      const descriptionPrompt: Message = {
        id: Date.now().toString(),
        content: t("Can you please describe the issue below?"),
        sender: "Support Bot",
        timestamp: formatDate(),
        isOwn: false,
      };

      setMessages((prevMessages) => [...prevMessages, descriptionPrompt]);
      setWaitingForDescription(true); // Enable input
    } else {
      setWaitingForDescription(false); // Default to disable input   ture
    }
  };

  <ChatInput
    onSendMessage={(message: string) => {
      handleSendMessage(message, null, null, false);
    }}
    disabled={isLoading || !waitingForDescription} // Disable input box based on the condition
  />;

  const allMessages = messages.concat(chatHistory);

  const navigateToQAContentGrid = () => {
    window.location.href = "/qa-content-grid"; // or use React Router
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-blue-200">
      <div className="w-full max-w-7xl h-[96vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden relative">
        {/* Chat Area */}
          <PushNotification/>
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

          {/* Existing Chat Components */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatWindow messages={allMessages} />
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
                onClick={() => handleContinueChat(true)}
              >
                {t("Yes")}
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                onClick={() => handleContinueChat(false)}
              >
                {t("No")}
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
