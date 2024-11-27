package com.example.springbootappwithh2database.controller;

import com.example.springbootappwithh2database.entity.ChatWorkFlow;
import com.example.springbootappwithh2database.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChatController {


    @Autowired
    private ChatService service;
    @GetMapping("/chat/{id}")
    public ChatWorkFlow getChatDetailsById(@PathVariable int id ){
      return   service.getChatDetailsById(id);

    }

    @PostMapping("/insert")
    public ChatWorkFlow insert(@RequestBody ChatWorkFlow product ){
        return   service.insertChatData(product);
    }
}
