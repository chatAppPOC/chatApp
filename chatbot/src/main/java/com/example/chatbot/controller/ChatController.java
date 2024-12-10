package com.example.chatbot.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.chatbot.dto.ChatRequest;
import com.example.chatbot.dto.ChatResponse;
import com.example.chatbot.entity.Case;
import com.example.chatbot.service.ChatService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ChatController {
	
	private static final Logger  LOG = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService chatService;
      
    @PostMapping("/chat")
    public ChatResponse getAllQuestionAndAnswers(@RequestBody ChatRequest input) throws Exception {
    	try {
    	ChatResponse chatMessages = chatService.getAllQuestionAndAnswers(input);
    	LOG.info("Api.getAllQuestionAndAnswers({}) => {}", input.getAnswerId(), chatMessages);
    	return chatMessages;
    	}catch (Exception e) {
    		LOG.error("Api.getAllQuestionAndAnswers({}) => error!!!", input.getAnswerId(), e);
			throw e;
		}
    }
    
    @PostMapping("/chat/caseCreation/{chatId}")
	public Case createSupportCase(@PathVariable Long chatId, @RequestParam Long userId) throws Exception {
		try {
			Case response = chatService.createSupportCaseByChatId(chatId, userId);
			LOG.info("Api.createSupportCase({}, {}) => {}", chatId, userId, response);
			return response;
		} catch (Exception e) {
			LOG.error("Api.createSupportCase({}, {}) => error!!!", chatId, userId, e);
			throw e;
		}
	}
}
