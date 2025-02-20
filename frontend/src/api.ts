import { generateBasicAuthHeader } from "./utils/basicAuth";
import axios from "axios";
export const getPlayerContent = async (contentId: number) => {
  const response = await axios.get(
    `http://localhost:8080/api/v2/contents/player/${contentId}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...generateBasicAuthHeader(),
      },
    }
  );
  return response.data;
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
  const caseResponse = await axios.get(
    `http://localhost:8080/api/CASE/feedback/${Number(caseId)}`,
    {
      headers: {
        ...generateBasicAuthHeader(),
      },
    }
  );

  return caseResponse.data;
};

export const getFeedbackByChatId = async (chatId: number) => {
  const response = await axios.get(
    `http://localhost:8080/api/CHAT/feedback/${chatId}`,
    {
      headers: {
        ...generateBasicAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
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

export const fetchFeedbackData = async (
  contentType: string,
  titleId: number,
  languageId: number
) => {
  const response = await axios.get(
    `http://localhost:8080/api/${contentType}/feedback-content/${titleId}/${languageId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        ...generateBasicAuthHeader(),
      },
    }
  );

  return response.data;
};
export const postFeedback = async (
  contentType: string,
  id: number,
  data: any
) => {
  const response = await axios.post(
    `http://localhost:8080/api/${contentType}/feedback/${id}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        ...generateBasicAuthHeader(),
      },
    }
  );

  return response.data;
};

export const getFeedbackById = async (type: string, id: number) => {
  const caseResponse = await axios.get(
    `http://localhost:8080/api/${type}/feedback/${Number(id)}`,
    {
      headers: {
        ...generateBasicAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return caseResponse.data;
};

export const getTitles = async () => {
  const response = await axios.get("http://localhost:8080/api/titles", {
    headers: {
      ...generateBasicAuthHeader(),
    },
  });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get("http://localhost:8080/api/users", {
    headers: {
      ...generateBasicAuthHeader(),
    },
  });
  return response.data;
};

export const getAllCases = async () => {
  const response = await axios.get("http://localhost:8080/api/allCases", {
    headers: {
      ...generateBasicAuthHeader(),
    },
  });
  return response.data;
};

export const getCaseById = async (id: number) => {
  const caseResponse = await axios.get(`http://localhost:8080/api/case`, {
    params: {
      caseId: id,
    },
    headers: {
      ...generateBasicAuthHeader(),
    },
  });
  return caseResponse.data;
};

export const getLanguages = async () => {
  const response = await axios.get("http://localhost:8080/api/languages", {
    headers: {
      ...generateBasicAuthHeader(),
    },
  });
  return response.data;
};
