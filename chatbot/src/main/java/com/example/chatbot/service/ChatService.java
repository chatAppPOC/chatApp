package com.example.chatbot.service;

import java.util.List;

import com.example.chatbot.dto.ChatInput;
import com.example.chatbot.entity.ChatContent;

public interface ChatService {

   public ChatContent insertChatData (ChatContent request);
   
   public List<ChatContent> getAllQuestionAndAnswers(ChatInput input) throws Exception;

}