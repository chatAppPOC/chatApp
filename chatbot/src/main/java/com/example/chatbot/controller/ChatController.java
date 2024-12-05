package com.example.chatbot.controller;

import java.util.List;

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

import com.example.chatbot.dto.ChatInput;
import com.example.chatbot.entity.Case;
import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.service.ChatService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ChatController {
	
	private static final Logger  LOG = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService chatService;
    
    @PostMapping("/content")
    public ChatContent insertContent(@RequestBody ChatContent content) {
        return  chatService.insertChatData(content);
    }
    
    @PostMapping("/chat")
    public List<ChatContent> getAllQuestionAndAnswers(@RequestBody ChatInput input) throws Exception {
    	try {
    	List<ChatContent> chatWorkFlow = chatService.getAllQuestionAndAnswers(input);
    	LOG.info("Api.getAllQuestionAndAnswers({}) => {}", input.getAnswerId(), chatWorkFlow);
    	return chatWorkFlow;
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
