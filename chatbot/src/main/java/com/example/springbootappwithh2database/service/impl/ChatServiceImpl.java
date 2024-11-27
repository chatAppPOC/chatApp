package com.example.springbootappwithh2database.service.impl;

import com.example.springbootappwithh2database.entity.ChatWorkFlow;
import com.example.springbootappwithh2database.repo.ChatRepo;
import com.example.springbootappwithh2database.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepo repo;

    @Override
    public ChatWorkFlow getChatDetailsById(int id) {
        return repo.findById(id).get();
    }

    @Override
    public ChatWorkFlow insertChatData(ChatWorkFlow request) {
        return repo.save(request);
    }
}
