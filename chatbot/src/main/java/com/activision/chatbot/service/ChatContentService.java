package com.activision.chatbot.service;

import java.sql.SQLException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.activision.chatbot.dto.ContentResponse;
import com.activision.chatbot.entity.Content;
import com.activision.chatbot.entity.Player;
import com.activision.chatbot.exception.UniqueConstraintViolationException;
import com.activision.chatbot.repo.ContentRepository;
import com.activision.chatbot.repo.PlayerRepository;

@Service
public class ChatContentService {
	private static final Logger LOG = LoggerFactory.getLogger(ChatContentService.class);
	private static final String ADMIN_USER = "ADMIN";

	@Autowired
	private ContentRepository contentRepository;
	
	@Autowired
	private PlayerRepository playerRepository;

	public Content getContentv2(Long id) {
		try {
			Optional<Content> result = contentRepository.findById(id);
			if(result.isPresent()) {
				LOG.debug("ChatContentService.getContentv2({}, {}) => {}", id, result.get());
				return result.get();
			}
			else{
				LOG.warn("ChatContentService.getContentv2({}) => Content ID does not exist", id);
				return (new Content());
			}
		} catch (Exception e) {
			LOG.error("ChatContentService.getContentv2() => error!!!", e);
			throw e;
		}
	}

	public List<ContentResponse> getContents() {
		try {
			List<ContentResponse> contents = contentRepository.findAllContents();
			LOG.debug("ChatContentService.getContents() => {}", contents);
			return contents;
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
	public Content updateContentv2(Long id, com.activision.chatbot.model.Content content, String name, Long titleId) {
		try {
			Content existingContent = contentRepository.findById(id)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
							"The content with " + id + " does not exist"));
			if (name != null) {
				Boolean nameExists = contentRepository.existsByName(name);
				if (nameExists && !name.equals(existingContent.getName())) {
					throw new UniqueConstraintViolationException("A content with the same name exists. Please try with a different name.");
				} else {
					existingContent.setName(name);
				}
			}
			if (titleId != null) {
				List<Content> list = contentRepository.findByLanguageIdAndTitle(existingContent.getLanguageId(),
						titleId);
				for(Content cont: list) {
					if (cont.getId() != existingContent.getId()) {
						throw new UniqueConstraintViolationException("A content with same title and language exists. Please try with a different title.");
					}
				}
				existingContent.setTitleId(titleId);
			}
			existingContent.setContent(content);
			existingContent.setUpdatedBy(ADMIN_USER);
			existingContent.setUpdatedOn(Instant.now());
			contentRepository.save(existingContent);
			LOG.debug("ChatContentService.updateContentv2({}, {}) => {}", id, existingContent);
			return existingContent;
		} catch (Exception e) {
			LOG.error("ChatContentService.updateContentv2({}, {}) => error!!!", id, content, e);
			throw e;
		}
	}

	@Transactional
	public Content createContentv2(com.activision.chatbot.model.Content content, Long languageId, String name, Long titleId) throws BadRequestException {
		if (name != null) {
			Boolean nameExists = contentRepository.existsByName(name);
			if (nameExists) {
				throw new UniqueConstraintViolationException("A content with the same name exists. Please try with a different name.");
			}
		}
		
		if(titleId != null) {
			List<Content> list = contentRepository.findByLanguageIdAndTitle(languageId,
					titleId);
			if(list.size() > 0) {
				throw new UniqueConstraintViolationException("A content with same title and language exists. Please try with a different title or language");
			}
		}
		
		try {
			Content newContent = new Content();
			newContent.setContent(content);
			newContent.setName(name);
			newContent.setLanguageId(languageId);
			newContent.setCreatedOn(Instant.now());
			newContent.setTitleId(titleId);
			newContent.setCreatedBy(ADMIN_USER);
			contentRepository.save(newContent);
			LOG.debug("ChatContentService.createContentv2({}, {}) => {}", content, languageId, newContent);
			return newContent;
		}
		catch (DataIntegrityViolationException e) {
		    if (e.getMostSpecificCause().getClass().getName().equals("org.postgresql.util.PSQLException") && ((SQLException) e.getMostSpecificCause()).getSQLState().equals("23505"))
		        throw new UniqueConstraintViolationException(e.getMostSpecificCause());
		    throw e;
		}
		catch (Exception e) {
			LOG.error("ChatContentService.createContentv2({}, {}) => error!!!", languageId, content, e);
			throw e;
		}	
	}

	@Transactional
	public Content copyContentv2(Long srcContentId, String name, Long titleId) throws Exception {
		try {
			Optional<Content> srcContent = contentRepository.findById(srcContentId);
			Content newContent = null;
			if (srcContent.isPresent()) {
				newContent = createContentv2(srcContent.get().getContent(), srcContent.get().getLanguageId(), name, titleId);
			}
			else {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND,"The content with " + srcContentId + " does not exist");
			}
			LOG.debug("ChatContentService.copyContentv2({}) => {}", srcContentId, newContent);
			return newContent;
		}
		catch (DataIntegrityViolationException e) {
		    if (e.getMostSpecificCause().getClass().getName().equals("org.postgresql.util.PSQLException") && ((SQLException) e.getMostSpecificCause()).getSQLState().equals("23505"))
		        throw new UniqueConstraintViolationException(e.getMostSpecificCause());
		    throw e;
		}
		catch (Exception e) {
			LOG.error("ChatContentService.copyContentv2({}) => error!!!", srcContentId, e);
			throw e;
		}
	}
	
	public Optional<Content> getContentByPlayerId(Long playerId){
		Optional<Player> player = playerRepository.findById(playerId);
		if(player.isPresent()) {
			List<Content> list = contentRepository.findByLanguageIdAndTitle(player.get().getPreferredLanguage(),
					player.get().getTitle());
			return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
		}
		return Optional.empty();
	}
    
}
