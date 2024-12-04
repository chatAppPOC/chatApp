package com.example.chatbot.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.chatbot.dto.ChatInput;
import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.service.ChatService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ChatController {
	
	private static final Logger  LOG = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService service;
    
    @GetMapping("/chat/history/{userId}")
    public Chat getChatDetailsById(@PathVariable String userId){
      return  service.getChatDetailsByUserId(userId);

    }

    @PostMapping("/content")
    public ChatContent insertContent(@RequestBody ChatContent content) {
        return   service.insertChatData(content);
    }
    
    @PostMapping("/chat")
    public List<ChatContent> getAllQuestionAndAnswers(@RequestBody ChatInput input) throws Exception {
    	try {
    	List<ChatContent> chatWorkFlow = service.getAllQuestionAndAnswers(input);
    	LOG.info("Api.getAllQuestionAndAnswers({}) => {}", input.getAnswerId(), chatWorkFlow);
    	return chatWorkFlow;
    	}catch (Exception e) {
    		LOG.error("Api.getAllQuestionAndAnswers({}) => error!!!", input.getAnswerId(), e);
			throw e;
		}
    }
}
