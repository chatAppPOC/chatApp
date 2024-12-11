package com.example.chatbot.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.chatbot.dto.ChatRequest;
import com.example.chatbot.dto.ChatResponse;
import com.example.chatbot.entity.Case;
import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.entity.User;
import com.example.chatbot.repo.CaseRepository;
import com.example.chatbot.repo.ChatContentRepository;
import com.example.chatbot.repo.ChatRepository;
import com.example.chatbot.repo.UserRepository;

@Service
public class ChatService {

	private static final Logger LOG = LoggerFactory.getLogger(ChatService.class);
	
    @Autowired
    private ChatContentRepository chatContentRepository;
    
    @Autowired 
    private ChatRepository chatRepository;
    
    @Autowired
    CaseRepository caseRepository;
    
    @Autowired
    UserRepository userRepository;
    
    public ChatContent insertChatData(ChatContent request) {
        return chatContentRepository.save(request);
    }
    
	@Transactional
	public ChatResponse getAllQuestionAndAnswers(ChatRequest input) throws Exception {
		try {
			
			List<ChatContent> chatContent = input.getChatId() == null ? 
					chatContentRepository.firstSetOfContent(input.getLanguageId())
					: chatContentRepository.nextSetOfContent(input.getAnswerId(), input.getLanguageId());	
			
			Chat chat = null;
			if(input.getChatId() == null) {
				chat = new Chat(input.getPlayerId(), "IN_PROGRESS");
			}
			else{
				chat = chatRepository.getExistingChat(input.getPlayerId(), input.getChatId());
				if (chat != null && chat.getId() != null) {
					if(input.getQuestionId() != null)
						chat.getQuestions().add(input.getQuestionId());
					if(input.getDescription() != null) {
						chat.setDescription(input.getDescription());
						chat.setStatus("CASE_CREATED");
					}
					else if(input.getAnswerId() != null) {
						chat.getAnswers().add(input.getAnswerId());
					}
					chat.setUpdatedOn(Instant.now());
	 		    } 
			}
			
			if(chatContent != null && chatContent.isEmpty() && input.getDescription() == null) {
				chat.setStatus("COMPLETE");
			}
			
			Chat savedChat = chatRepository.save(chat);
			
			ChatResponse chatMessages = new ChatResponse();
			chatMessages.setChatId(savedChat.getId());
			chatMessages.setOptions(chatContent);
			
			LOG.debug("ChatService.getAllQuestionAndAnswers({}) => {}", input.getAnswerId(), chatMessages);
			return chatMessages;
		} catch (Exception e) {
			LOG.error("ChatService.getAllQuestionAndAnswers({}) => error!!!", input.getAnswerId(), e);
			throw e;
		}
	}

	@Transactional
	public Case createSupportCaseByChatId(Long chatId, Long userId) throws Exception {
		try {
			Optional<Chat> chat = chatRepository.findById(chatId);
			Optional<User> user = userRepository.findById(userId);
			Case newCase = null;
			if (chat.isPresent() && user.isPresent()) {
					newCase = new Case(user.get().getId(), chat.get().getId());
			} else {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Either chatId or userId is invalid");
			}
			Case response = caseRepository.save(newCase);
			LOG.debug("ChatService.createSupportCaseByChatId({}, {}) => {}", chatId, userId, response);
			return response;
		} catch (Exception e) {
			LOG.error("ChatService.createSupportCaseByChatId({}, {}) => error!!!", chatId, userId, e);
			throw e;
		}
	}

	public Case reAssignTicketToAgent(Long caseId, Long userId) {
		try {
			Case caseResponse = caseRepository.findById(caseId)
					.orElseThrow(() -> new RuntimeException("Case is not found"));
			if(userId !=null) {
				caseResponse.setUserId(userId);
			}
			Case response = caseRepository.save(caseResponse);
			LOG.debug("ChatService.assignTicketToAgent({}, {}) => {}", caseId, userId, response);
			return response;
		} catch (Exception e) {
			LOG.error("ChatService.assignTicketToAgent({}, {}) => error!!!", caseId, userId, e);
			throw e;
		}
	}
}
