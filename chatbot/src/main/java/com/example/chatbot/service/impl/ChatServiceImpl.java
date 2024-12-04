package com.example.chatbot.service.impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.chatbot.dto.ChatInput;
import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.repo.ChatAuditRepo;
import com.example.chatbot.repo.ChatRepo;
import com.example.chatbot.service.ChatService;


@Service
public class ChatServiceImpl implements ChatService {

	private static final Logger  LOG = LoggerFactory.getLogger(ChatServiceImpl.class);
	private Integer FIRST_CHAT_ID = 0;
	
    @Autowired
    private ChatRepo repo;
    
    @Autowired 
    ChatAuditRepo auditRepo;
    
    @Override
    public Chat getChatDetailsByUserId(String userId) {
    	return auditRepo.findByUserId(userId);
    }

    @Override
    public ChatContent insertChatData(ChatContent request) {
        return repo.save(request);
    }
    
	@Override
	@Transactional
	public List<ChatContent> getAllQuestionAndAnswers(ChatInput input) throws Exception {
		try {
			List<ChatContent> chatWorkFlows = input.getIsChatBegin() ? 
					repo.getAllQuestionAndAnswers(FIRST_CHAT_ID) :  repo.getAllQuestionAndAnswers(input.getAnswerId());			
			Chat audit = auditRepo.findByUserId(input.getUserId());
			if (audit != null && audit.getId() != null) {
				if(input.getQuestionId() != null)
					audit.getQuestions().add(input.getQuestionId());
				audit.setUpdatedOn(Instant.now());
				if(input.getDescription() == null) {
		            audit.getAnswers().add(input.getAnswerId());
					audit.setUpdatedOn(Instant.now());
				}
				else {
					audit.setDescription(input.getDescription());
					audit.setStatus("CASE_CREATED");
				}	
			} 
			else {
				audit = new Chat(input.getUserId(), new ArrayList<Integer>(), new ArrayList<Integer>(),
						null, "IN_PROGRESS", Instant.now(), Instant.now());
			}
			if(chatWorkFlows.isEmpty() && input.getDescription() == null || chatWorkFlows.isEmpty() && input.getQuestionId() == null) {
				audit.setStatus("COMPLETE");
			}
			auditRepo.save(audit);
			LOG.debug("ChatService.getAllQuestionAndAnswers({}) => {}", input.getAnswerId(), chatWorkFlows);
			return chatWorkFlows;
		} catch (Exception e) {
			LOG.error("ChatService.getAllQuestionAndAnswers({}) => error!!!", input.getAnswerId(), e);
			throw e;
		}
	}
}
