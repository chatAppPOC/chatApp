package com.example.chatbot.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.chatbot.dto.ContentResponse;
import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.entity.Content;
import com.example.chatbot.entity.Model;
import com.example.chatbot.repo.ChatContentRepository;
import com.example.chatbot.repo.ContentRepository;
import com.example.chatbot.repo.ModelRepository;

@Service
public class ChatContentService {
	private static final Logger LOG = LoggerFactory.getLogger(ChatContentService.class);
	private static final String ADMIN_USER = "ADMIN";

	@Autowired
	private ChatContentRepository chatContentRepository;

	@Autowired
	private ContentRepository contentRepository;

	@Autowired
	private ModelRepository modelRepository;

	@Transactional
	public ChatContent updateContent(Long contentId, ChatContent content) {
		try {
			ChatContent existingChatContent = chatContentRepository.findById(contentId)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
							"The content with " + contentId + " does not exist"));
			if (content.getContent() != null && !content.getContent().isEmpty()) {
				existingChatContent.setContent(content.getContent());
			}
			if (content.getContentType() != null && !content.getContentType().isEmpty()) {
				existingChatContent.setContentType(content.getContentType());
			}
			chatContentRepository.save(existingChatContent);
			LOG.debug("ChatContentService.updateContent({}, {}) => {}", contentId, existingChatContent);
			return existingChatContent;
		} catch (Exception e) {
			LOG.error("ChatContentService.updateContent({}, {}) => error!!!", content, e);
			throw e;
		}
	}

	@Transactional
	public ChatContent deleteContent(Long contentId) {
		try {
			ChatContent existingChatContent = chatContentRepository.findById(contentId)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
							"The content with " + contentId + " does not exist"));
			chatContentRepository.deleteById(contentId);
			LOG.debug("ChatContentService.updateContent({}, {}) => {}", contentId, existingChatContent);
			return existingChatContent;
		} catch (Exception e) {
			LOG.error("ChatContentService.deleteContent({}, {}) => error!!!", contentId, e);
			throw e;
		}
	}

	@Transactional
	public ChatContent createContent(Long contentId, ChatContent content) {
		try {
			ChatContent existingChatContent = chatContentRepository.findById(contentId)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
							"The content with " + contentId + " does not exist"));
			ChatContent newChatContent = null;
			if (content != null && content.getParentId() == contentId && content.getContent() != null
					&& content.getModelId() != null) {
				if (content.getContentType().equals("Question")
						&& existingChatContent.getContentType().equals("Answer")) {
					// check if there are questions already for this answer
					List<ChatContent> questions = chatContentRepository.checkIfQuestionExistsForAnswer(contentId,
							content.getModelId());
					if (questions != null) {
						throw new ResponseStatusException(HttpStatus.NOT_FOUND,
								"Cannot add more than one question to an answer");
					} else {
						newChatContent = chatContentRepository.save(content);
					}
				}
				if (content.getContentType().equals("Answer")
						&& existingChatContent.getContentType().equals("Question")) {
					// question can have multiple answers
					newChatContent = chatContentRepository.save(content);

				}
				if (content.getContentType().equals("Question")
						&& existingChatContent.getContentType().equals("Question")
						|| content.getContentType().equals("Answer")
								&& existingChatContent.getContentType().equals("Answer")) {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND,
							"Answer cannot be child of answer OR Question cannot be child of Question");
				}

			}
			LOG.debug("ChatContentService.createContent({}, {}) => {}", contentId, existingChatContent, newChatContent);
			return newChatContent;
		} catch (Exception e) {
			LOG.error("ChatContentService.createContent({}, {}) => error!!!", contentId, e);
			throw e;
		}
	}

	@Transactional
	public boolean copyContent(Long srcModelId) {
		try {
			List<ChatContent> srcContents = chatContentRepository.findAllByModelId(srcModelId);
			Model existingModel = modelRepository.findById(srcModelId)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
							"The model with " + srcModelId + " does not exist"));
			Model model = new Model(existingModel.getLanguageId());
			Model newModel = modelRepository.save(model);

			for (ChatContent src : srcContents) {
				ChatContent dest = copyChatContent(src, newModel.getId());
				chatContentRepository.save(dest);
			}

			Map<Long, Long> idMap = new HashMap<>();
			List<ChatContent> destContents = chatContentRepository.findAllByModelId(newModel.getId());
			for (int i = 0; i < srcContents.size(); i++) {
				idMap.put(srcContents.get(i).getId(), destContents.get(i).getId());
			}
			for (ChatContent dest : destContents) {
				dest.setParentId(idMap.get(dest.getParentId()));
				chatContentRepository.save(dest);
			}
			LOG.debug("ChatContentService.copyContent({}) => {}", srcModelId, true);
			return true;
		} catch (Exception e) {
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

	public Optional<Content> getContentv2(Long id) {
		try {
			Optional<Content> result = contentRepository.findById(id);
			LOG.debug("ChatContentService.getContentv2({}, {}) => {}", id, result);
			return result;
		} catch (Exception e) {
			LOG.error("ChatContentService.getContentv2() => error!!!", e);
			throw e;
		}
	}

	public List<ContentResponse> getContents() {
		try {
			List<Content> contents = contentRepository.findAll();
			List<ContentResponse> result = new ArrayList<>();
			if (contents != null) {
				for (Content content : contents) {
					ContentResponse response = new ContentResponse();
					if (content.getCreatedOn() != null)
						response.setCreatedOn(content.getCreatedOn());
					if (content.getUpdatedOn() != null)
						response.setUpdatedOn(content.getUpdatedOn());
					if (content.getName() != null)
						response.setName(content.getName());
					if (content.getId() != null)
						response.setId(content.getId());
					if (content.getUpdatedBy() != null)
						response.setUpdatedBy(content.getUpdatedBy());
					if (content.getCreatedBy() != null)
						response.setCreatedBy(content.getCreatedBy());
					result.add(response);
				}
			}
			LOG.debug("ChatContentService.getContents() => {}", result);
			return result;
		} catch (Exception e) {
			LOG.error("ChatContentService.getContents() => error!!!", e);
			throw e;
		}
	}

	@Transactional
	public Content deleteContentv2(Long id) {
		try {
			Content existingContent = contentRepository.findById(id)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
							"The content with " + id + " does not exist"));
			contentRepository.deleteById(id);
			LOG.debug("ChatContentService.deleteContentv2({}, {}) => {}", id, existingContent);
			return existingContent;
		} catch (Exception e) {
			LOG.error("ChatContentService.deleteContentv2() => error!!!", e);
			throw e;
		}
	}

	@Transactional
	public Content updateContentv2(Long id, com.example.chatbot.model.Content content, String name) {
		try {
			Content existingContent = contentRepository.findById(id)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
							"The content with " + id + " does not exist"));

			existingContent.setContent(content);
			existingContent.setName(name);
			existingContent.setUpdatedBy(ADMIN_USER);
			existingContent.setUpdatedOn(Instant.now());
			contentRepository.save(existingContent);
			LOG.debug("ChatContentService.updateContentv2({}, {}) => {}", id, existingContent);
			return existingContent;
		} catch (Exception e) {
			LOG.error("ChatContentService.updateContentv2({}, {}) => error!!!", id, content);
			throw e;
		}
	}

	@Transactional
	public Content createContentv2(com.example.chatbot.model.Content content, Long languageId, String name) {
		try {
			Content newContent = new Content();
			newContent.setContent(content);
			newContent.setName(name);
			newContent.setLanguageId(languageId);
			newContent.setCreatedOn(Instant.now());
			newContent.setCreatedBy(ADMIN_USER);
			contentRepository.save(newContent);
			LOG.debug("ChatContentService.createContentv2({}, {}) => {}", content, languageId, newContent);
			return newContent;
		} catch (Exception e) {
			LOG.error("ChatContentService.createContentv2({}) => error!!!", content);
			throw e;
		}
	}

	@Transactional
	public Content copyContentv2(Long srcContentId, String name) {
		try {
			Optional<Content> srcContent = contentRepository.findById(srcContentId);
			Content newContent = null;
			if (srcContent.isPresent()) {
				newContent = createContentv2(srcContent.get().getContent(), srcContent.get().getLanguageId(), name);
			}
			LOG.debug("ChatContentService.copyContentv2({}) => {}", srcContentId, newContent);
			return newContent;
		} catch (Exception e) {
			LOG.error("ChatContentService.copyContentv2({}) => error!!!", srcContentId);
			throw e;
		}
	}

}
