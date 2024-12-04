package com.example.chatbot.service;

import java.util.List;
import java.util.Optional;

import com.example.chatbot.dto.ChatInput;
import com.example.chatbot.entity.ChatAudit;
import com.example.chatbot.entity.ChatWorkFlow;

public interface ChatService {

   public ChatAudit getChatDetailsByUserId(String userId);

   public ChatWorkFlow insertChatData (ChatWorkFlow request);
   
   public List<ChatWorkFlow> getAllQuestionAndAnswers(ChatInput input) throws Exception;

}