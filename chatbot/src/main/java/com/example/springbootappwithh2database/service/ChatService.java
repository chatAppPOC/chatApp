package com.example.springbootappwithh2database.service;

import java.util.List;

import com.example.springbootappwithh2database.entity.ChatWorkFlow;

public interface ChatService {

   public ChatWorkFlow getChatDetailsById(int id);

   public ChatWorkFlow insertChatData (ChatWorkFlow request);
   
   public List<ChatWorkFlow> getAllQuestionAndAnswers(Integer questionId, String userId) throws Exception;
}
