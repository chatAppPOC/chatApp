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
import com.example.chatbot.entity.ChatAudit;
import com.example.chatbot.entity.ChatWorkFlow;
import com.example.chatbot.service.ChatService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ChatController {
	
	private static final Logger  LOG = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService service;
    
    @GetMapping("/chat/history/{userId}")
    public ChatAudit getChatDetailsById(@PathVariable String userId){
      return  service.getChatDetailsByUserId(userId);

    }

    @PostMapping("/content")
    public ChatWorkFlow insertContent(@RequestBody ChatWorkFlow content) {
        return   service.insertChatData(content);
    }
    
    @PostMapping("/chat")
    public List<ChatWorkFlow> getAllQuestionAndAnswers(@RequestBody ChatInput input) throws Exception {
    	try {
    	List<ChatWorkFlow> chatWorkFlow = service.getAllQuestionAndAnswers(input);
    	LOG.info("Api.getAllQuestionAndAnswers({}) => {}", input.getAnswerId(), chatWorkFlow);
    	return chatWorkFlow;
    	}catch (Exception e) {
    		LOG.error("Api.getAllQuestionAndAnswers({}) => error!!!", input.getAnswerId(), e);
			throw e;
		}
    }
}
