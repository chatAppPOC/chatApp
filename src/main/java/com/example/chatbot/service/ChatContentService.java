package com.example.chatbot.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.entity.Model;
import com.example.chatbot.repo.ChatContentRepository;
import com.example.chatbot.repo.ModelRepository;

@Service
public class ChatContentService {
	private static final Logger LOG = LoggerFactory.getLogger(ChatContentService.class);

    
	@Autowired
	private ChatContentRepository chatContentRepository;
	
	@Autowired
	private ModelRepository modelRepository;
	
	@Transactional
	public ChatContent updateContent(Long contentId, ChatContent content) {
		try {
			ChatContent existingChatContent = chatContentRepository.findById(contentId)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "The content with "+ contentId+" does not exist"));
			if(content.getContent() != null && !content.getContent().isEmpty()) {
				existingChatContent.setContent(content.getContent());
			}
			if(content.getContentType() != null && !content.getContentType().isEmpty()) {
				existingChatContent.setContentType(content.getContentType());
			}
			chatContentRepository.save(existingChatContent);
			LOG.debug("ChatService.updateContent({}, {}) => {}", contentId, existingChatContent);
			return existingChatContent;
		}
		catch (Exception e) {
			LOG.error("ChatContentService.updateContent({}, {}) => error!!!", content, e);
			throw e;
		}	
	}
	
	@Transactional
	public ChatContent deleteContent(Long contentId) {
		try {
			ChatContent existingChatContent = chatContentRepository.findById(contentId)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "The content with "+ contentId+" does not exist"));
			chatContentRepository.deleteById(contentId);
			LOG.debug("ChatService.updateContent({}, {}) => {}", contentId, existingChatContent);
			return existingChatContent;
		}
		catch (Exception e) {
			LOG.error("ChatContentService.updateContent({}, {}) => error!!!", contentId, e);
			throw e;
		}	
	}
	
	@Transactional
	public ChatContent createContent(Long contentId, ChatContent content) {
		try {
			ChatContent existingChatContent = chatContentRepository.findById(contentId)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "The content with "+ contentId+" does not exist"));
			ChatContent newChatContent = null;
			if(content != null && content.getParentId() == contentId &&
					content.getContent() != null && content.getModelId() != null){
				if(content.getContentType().equals("Question") && existingChatContent.getContentType().equals("Answer")) {
					// check if there are questions already for this answer
					List<ChatContent> questions = chatContentRepository.checkIfQuestionExistsForAnswer(contentId, content.getModelId());
					if(questions != null) {
						throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cannot add more than one question to an answer");
					}
					else {
						newChatContent = chatContentRepository.save(content);
					}
				}
				if(content.getContentType().equals("Answer") && existingChatContent.getContentType().equals("Question")) {
					//question can have multiple answers
					newChatContent = chatContentRepository.save(content);

				}
				if(content.getContentType().equals("Question") && existingChatContent.getContentType().equals("Question") 
						|| content.getContentType().equals("Answer") && existingChatContent.getContentType().equals("Answer")) {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Answer cannot be child of answer OR Question cannot be child of Question");
				}
			
			}
			LOG.debug("ChatService.updateContent({}, {}) => {}", contentId, existingChatContent,newChatContent);
			return newChatContent;
		}
		catch (Exception e) {
			LOG.error("ChatContentService.updateContent({}, {}) => error!!!", contentId, e);
			throw e;
		}	
	}
	
	@Transactional
	public boolean copyContent(Long srcModelId) {
		try {
			List<ChatContent> srcContents = chatContentRepository.findAllByModelId(srcModelId);
			Model existingModel = modelRepository.findById(srcModelId)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "The model with "+ srcModelId+" does not exist"));
			Model model = new Model(existingModel.getLanguageId());
			Model newModel = modelRepository.save(model);
			
            for(ChatContent src : srcContents) {
            	ChatContent dest = copyChatContent(src, newModel.getId());
				chatContentRepository.save(dest);
            }
			
            Map<Long, Long> idMap = new HashMap<>();
			List<ChatContent> destContents = chatContentRepository.findAllByModelId(newModel.getId());	
			for(int i = 0; i < srcContents.size(); i++) {
				idMap.put(srcContents.get(i).getId(), destContents.get(i).getId());
			}
			for(ChatContent dest : destContents) {
				dest.setParentId(idMap.get(dest.getParentId()));
				chatContentRepository.save(dest);
			}
			LOG.debug("ChatContentService.copyContent({}) => {}", srcModelId, true);
			return true;
		}
		catch (Exception e) {
			LOG.error("ChatContentService.copyContent() => error!!!", e);
			throw e;
		}	
		
	}
	
	private ChatContent copyChatContent(ChatContent src, Long modelId) {
		ChatContent dest = new ChatContent();
		dest.setContent(src.getContent());
		dest.setContentType(src.getContentType());
		dest.setParentId(src.getParentId());
		dest.setModelId(modelId);
		return dest;
	}
}
