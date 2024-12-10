package com.example.chatbot.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.repo.ChatContentRepository;

@Service
public class ChatContentService {
	private static final Logger LOG = LoggerFactory.getLogger(ChatContentService.class);

    
	@Autowired
	private ChatContentRepository chatContentRepository;
	
	@Transactional
	public ChatContent updateContent(ChatContent content) {
		try {
			Optional<ChatContent> chatContent = chatContentRepository.findById(content.getId());
			ChatContent updatedContent = null;
			if(chatContent.isPresent()) {
				updatedContent = chatContentRepository.save(content);
			}
			else {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The given content does not exist");
			}
			LOG.debug("ChatService.updateContent({}, {}) => {}", content, updatedContent);
			return updatedContent;
		}
		catch (Exception e) {
			LOG.error("ChatContentService.updateContent({}, {}) => error!!!", content, e);
			throw e;
		}	
	}
	
}
