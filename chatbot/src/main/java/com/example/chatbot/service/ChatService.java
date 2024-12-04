package com.example.chatbot.service;

import java.util.List;

import com.example.chatbot.dto.ChatInput;
import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.ChatContent;

public interface ChatService {

   public Chat getChatDetailsByUserId(String userId);

   public ChatContent insertChatData (ChatContent request);
   
   public List<ChatContent> getAllQuestionAndAnswers(ChatInput input) throws Exception;

}