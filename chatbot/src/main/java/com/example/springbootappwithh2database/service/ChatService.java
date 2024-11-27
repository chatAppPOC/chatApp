package com.example.springbootappwithh2database.service;

import com.example.springbootappwithh2database.entity.ChatWorkFlow;

public interface ChatService {

   public ChatWorkFlow getChatDetailsById(int id );

   public ChatWorkFlow insertChatData (ChatWorkFlow request);
}
