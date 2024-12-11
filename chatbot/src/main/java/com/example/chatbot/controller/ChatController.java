package com.example.chatbot.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
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
import com.example.chatbot.repo.CaseRepository;
import com.example.chatbot.service.ChatService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ChatController {
	
	private static final Logger  LOG = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService chatService;
    
    @Autowired
    CaseRepository caseRepository;
      
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
	public Case createSupportCase(@PathVariable Long chatId) throws Exception {
		try {
			Case response = chatService.createSupportCaseByChatId(chatId);
			LOG.info("Api.createSupportCase({}, {}) => {}", chatId, response);
			return response;
		} catch (Exception e) {
			LOG.error("Api.createSupportCase({}, {}) => error!!!", chatId, e);
			throw e;
		}
	}
    
    @PostMapping("/chat/{caseId}/assign")
    @Transactional
	public Case reAssignTicketToAgent(@PathVariable Long caseId, @RequestParam Long userId) {
		try {
			Case caseResponse = caseRepository.findById(caseId)
					.orElseThrow(() -> new RuntimeException("Case is not found"));		
			Case updatedTicket = chatService.reAssignTicketToAgent(userId, caseResponse);
			LOG.info("Api.assignTicket({}, {}) => {}", caseId, userId, updatedTicket);
			return updatedTicket;
		} catch (Exception e) {
			LOG.error("Api.assignTicket({}, {}) => error!!!", caseId, userId, e);
			throw e;
		}
	}
}
