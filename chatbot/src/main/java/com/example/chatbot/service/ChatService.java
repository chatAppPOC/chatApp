package com.example.chatbot.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.chatbot.dto.ChatInput;
import com.example.chatbot.dto.ChatOutput;
import com.example.chatbot.entity.Case;
import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.entity.User;
import com.example.chatbot.repo.CaseRepository;
import com.example.chatbot.repo.ChatContentRepo;
import com.example.chatbot.repo.ChatRepo;
import com.example.chatbot.repo.UserRepo;

@Service
public class ChatService {

	private static final Logger LOG = LoggerFactory.getLogger(ChatService.class);
	private Integer FIRST_SET_ID = 0;
	
    @Autowired
    private ChatContentRepo chatContentRepo;
    
    @Autowired 
    private ChatRepo chatRepo;
    
    @Autowired
    CaseRepository caseRepo;
    
    @Autowired
    UserRepo userRepo;
    
    public ChatContent insertChatData(ChatContent request) {
        return chatContentRepo.save(request);
    }
    
	@Transactional
	public ChatOutput getAllQuestionAndAnswers(ChatInput input) throws Exception {
		try {
			
			List<ChatContent> chatContent = input.getChatId() == null ? 
					chatContentRepo.getQuestionAndAnswers(FIRST_SET_ID) : chatContentRepo.getQuestionAndAnswers(input.getAnswerId());	
			
			Chat chat = null;
			if(input.getChatId() == null) {
				chat = new Chat(input.getPlayerId(), "IN_PROGRESS");
			}
			else{
				chat = chatRepo.getExistingChat(input.getPlayerId(), input.getChatId());
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
			
			Chat savedChat = chatRepo.save(chat);
			
			ChatOutput chatMessages = new ChatOutput();
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
			Optional<Chat> chat = chatRepo.findById(chatId);
			Optional<User> user = userRepo.findById(userId);
			Case newCase = null;
			if (chat.isPresent() && user.isPresent()) {
					newCase = new Case(user.get().getId(), chat.get().getId());
			} else {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Either chatId or userId is invalid");
			}
			Case response = caseRepo.save(newCase);
			LOG.debug("ChatService.createSupportCaseByChatId({}, {}) => {}", chatId, userId, response);
			return response;
		} catch (Exception e) {
			LOG.error("ChatService.createSupportCaseByChatId({}, {}) => error!!!", chatId, userId, e);
			throw e;
		}
	}
}
