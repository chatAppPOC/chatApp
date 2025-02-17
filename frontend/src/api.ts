import { generateBasicAuthHeader } from "./utils/basicAuth";

export const getPlayerContent = async (contentId: number) => {
  const response = await fetch(
    // `http://localhost:8080/api/v2/content?contentId=32`,
    `http://localhost:8080/api/v2/contents/player/${contentId}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...generateBasicAuthHeader(),
      },
    }
  );
  const data = await response.json();
  return data;
};

export const saveHistory = async (request: any) => {
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
    return data;
  } catch (error) {
    console.error("Error sending question:", error);
    return null;
  }
};

export const getChatHistoryByChatId = async (chatId: number) => {
  try {
    const chatResponse = await fetch(
      `http://localhost:8080/api/v2/chat/${chatId}`,
      {
        method: "GET",
        headers: {
          ...generateBasicAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
    const data = await chatResponse.json();
    return data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return null;
  }
};

export const getFeedbackByCaseId = async (caseId: number) => {
  const caseResponse = await fetch(
    `http://localhost:8080/api/case/feedback/${Number(caseId)}`,
    {
      method: "GET",
      headers: {
        ...generateBasicAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  const data = await caseResponse.json();
  return data;
};

export const getFeedbackByChatId = async (chatId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/CHAT/feedback/${chatId}`,
      {
        method: "GET",
        headers: {
          ...generateBasicAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  }
};

export const getPlayerChatHistory = async (playerId: number) => {
  const response = await fetch(
    `http://localhost:8080/api/chat/history/${playerId}?page=0&size=500`,
    {
      headers: {
        ...generateBasicAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};
