package com.example.springbootappwithh2database.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.springbootappwithh2database.entity.ChatWorkFlow;
import com.example.springbootappwithh2database.service.ChatService;

@RestController
@RequestMapping("/api")
public class ChatController {
	
	private static final Logger  LOG = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService service;
    @GetMapping("/chat/{id}")
    public ChatWorkFlow getChatDetailsById(@PathVariable int id){
      return   service.getChatDetailsById(id);

    }

    @PostMapping("/insert")
    public ChatWorkFlow insert(@RequestBody ChatWorkFlow product) {
        return   service.insertChatData(product);
    }
    
    @GetMapping("/chat/question/{questionId}")
    public List<ChatWorkFlow> getAllQuestionAndAnswers(@PathVariable Integer questionId, @RequestParam String userId) throws Exception {
    	try {
    	List<ChatWorkFlow> chatWorkFlow = service.getAllQuestionAndAnswers(questionId, userId);
    	LOG.info("Api.getAllQuestionAndAnswers({}) => {}", questionId, chatWorkFlow);
    	return chatWorkFlow;
    	}catch (Exception e) {
    		LOG.error("Api.getAllQuestionAndAnswers({}) => error!!!", questionId, e);
			throw e;
		}
    }
}
