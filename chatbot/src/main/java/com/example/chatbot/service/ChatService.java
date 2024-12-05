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
	public List<ChatContent> getAllQuestionAndAnswers(ChatInput input) throws Exception {
		try {
			List<ChatContent> chatMessages = input.getQuestionId() == null ? 
					chatContentRepo.getQuestionAndAnswers(FIRST_SET_ID) : chatContentRepo.getQuestionAndAnswers(input.getAnswerId());	
			
			Chat chat = chatRepo.getExistingChat(input.getUserId());
			
 		    if (chat != null && chat.getId() != null) {
				if(input.getQuestionId() != null)
					chat.getQuestions().add(input.getQuestionId());
				chat.setUpdatedOn(Instant.now());
				
				if(input.getDescription() == null) {
		            chat.getAnswers().add(input.getAnswerId());
					chat.setUpdatedOn(Instant.now());
				}
				else {
					chat.setDescription(input.getDescription());
					chat.setStatus("CASE_CREATED");
				}	
			} 
			else {
				chat = new Chat(input.getUserId(), new ArrayList<Integer>(), new ArrayList<Integer>(),
						null, "IN_PROGRESS", Instant.now(), Instant.now());
			}
			
			if(chatMessages != null && chatMessages.isEmpty() && input.getDescription() == null) {
				chat.setStatus("COMPLETE");
			}
			
			if(chatMessages != null && chatMessages.size() == 1 && chatMessages.get(0).getContentType().equals("Question")){
				chat.getQuestions().add(chatMessages.get(0).getId());
				chat.setStatus("COMPLETE");	
			}
			chatRepo.save(chat);
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
