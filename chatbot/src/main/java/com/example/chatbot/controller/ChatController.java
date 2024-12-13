package com.example.chatbot.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.chatbot.dto.ChatRequest;
import com.example.chatbot.dto.ChatResponse;
import com.example.chatbot.entity.Case;
import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.User;
import com.example.chatbot.repo.CaseRepository;
import com.example.chatbot.repo.UserRepository;
import com.example.chatbot.service.ChatService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ChatController {

	private static final Logger LOG = LoggerFactory.getLogger(ChatController.class);

	@Autowired
	private ChatService chatService;

	@Autowired
	CaseRepository caseRepository;

	@Autowired
	UserRepository userRepository;

	@PostMapping("/chat")
	public ChatResponse performChat(@RequestBody ChatRequest input) throws Exception {
		try {
			ChatResponse chatMessages = chatService.performChat(input);
			LOG.info("Api.performChat({}) => {}", input, chatMessages);
			return chatMessages;
		} catch (Exception e) {
			LOG.error("Api.performChat({}) => error!!!", input, e);
			throw e;
		}
	}

	@GetMapping("/chat/history/{playerId}")
	public List<Chat> getChatHistory(@PathVariable Long playerId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) throws Exception {
		try {
			Page<Chat> chatMessages = chatService.getChatHistory(playerId, page, size);
			List<Chat> result = chatMessages.getContent();
			LOG.info("Api.getChatHistory({}) => {}", playerId, chatMessages);
			return result;
		} catch (Exception e) {
			LOG.error("Api.getChatHistory({}) => error!!!", playerId, e);
			throw e;
		}
	}

	@PutMapping("/case/{caseId}/re-assign/{userId}")
	public Case reAssignTicketToAgent(@PathVariable Long caseId, @PathVariable Long userId) {
		try {
			Optional<Case> caseResp = caseRepository.findById(caseId);
			Optional<User> userResp = userRepository.findById(userId);
			if (caseResp.isPresent() && userResp.isPresent()) {
				caseResp.get().setUserId(userResp.get().getId());
			} else
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Either caseId or userId is invalid");
			Case updatedTicket = caseRepository.save(caseResp.get());
			LOG.info("Api.assignTicket({}, {}) => {}", caseId, userId, updatedTicket);
			return updatedTicket;
		} catch (Exception e) {
			LOG.error("Api.assignTicket({}, {}) => error!!!", caseId, userId, e);
			throw e;
		}
	}
}
