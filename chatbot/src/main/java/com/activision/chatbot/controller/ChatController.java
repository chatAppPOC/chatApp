package com.activision.chatbot.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.activision.chatbot.dto.ChatMessageRequest;
import com.activision.chatbot.dto.ChatRequestv2;
import com.activision.chatbot.dto.ChatResponsev2;
import com.activision.chatbot.dto.FeedbackContentRequest;
import com.activision.chatbot.dto.FeedbackRequest;
import com.activision.chatbot.entity.Case;
import com.activision.chatbot.entity.Chat;
import com.activision.chatbot.entity.ChatMessage;
import com.activision.chatbot.entity.Feedback;
import com.activision.chatbot.entity.Feedback.FeedbackCategory;
import com.activision.chatbot.entity.FeedbackContent;
import com.activision.chatbot.repo.CaseRepository;
import com.activision.chatbot.repo.ChatRepository;
import com.activision.chatbot.repo.FeedbackContentRepository;
import com.activision.chatbot.repo.FeedbackRepository;
import com.activision.chatbot.repo.UserRepository;
import com.activision.chatbot.service.ChatService;

@RestController
@RequestMapping("/api")
public class ChatController {

	private static final Logger LOG = LoggerFactory.getLogger(ChatController.class);

	@Autowired
	private ChatService chatService;

	@Autowired
	CaseRepository caseRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	private ChatRepository chatRepository;

	@Autowired
	FeedbackRepository feedbackRepo;

	@Autowired
	FeedbackContentRepository feedbackContentRepo;

	@PostMapping("v2/chat")
	public ChatResponsev2 performChatv2(@RequestBody ChatRequestv2 request) throws Exception {
		try {
			ChatResponsev2 chatMessages = chatService.performChatv2(request);
			LOG.info("Api.performChatv2({}) => {}", request, chatMessages);
			return chatMessages;
		} catch (Exception e) {
			LOG.error("Api.performChatv2({}) => error!!!", request);
			throw e;
		}
	}

	@GetMapping("/chat/history/{playerId}")
	public List<Chat> getChatHistory(@PathVariable Long playerId, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size) throws Exception {
		try {
			Page<Chat> chatMessages = chatService.getChatHistory(playerId, page, size);
			List<Chat> result = new ArrayList<>();
			if (chatMessages != null) {
				result = chatMessages.getContent();
			}
			LOG.info("Api.getChatHistory({}) => Result size : {}", playerId, result.size());
			return result;
		} catch (Exception e) {
			LOG.error("Api.getChatHistory({}) => error!!!", playerId, e);
			throw e;
		}
	}

	@GetMapping("v2/chat/{chatId}")
	public Chat getChat(@PathVariable Long chatId) {
		try {
			Chat chat = chatService.getChat(chatId);
			LOG.info("Api.getChat({}) => {}", chatId, chat);
			return chat;
		} catch (Exception e) {
			LOG.error("Api.getChat({}, {}) => error!!!", chatId, e);
			throw e;
		}
	}

	@PutMapping("/case/re-assign")
	@PreAuthorize("hasAnyAuthority('ADMIN','USER')")
	public Case updateTicket(@RequestBody Case input) {
		try {
			Optional<Case> caseResp = caseRepository.findById(input.getId());
			if (caseResp.isPresent()) {
				Case existingCase = caseResp.get();

				// Update the existing case with the new values
				existingCase.setUserId(input.getUserId());
				existingCase.setCaseType(input.getCaseType());
				existingCase.setCompletedOn(input.getCompletedOn());
				existingCase.setStatus(input.getStatus());
				existingCase.setStartedOn(input.getStartedOn());
				existingCase.setReopenedOn(input.getReopenedOn());
				existingCase.setTitle(input.getTitle());

				// Save the updated case
				LOG.info("Api.updateTicket({}, {}) => {}", input, existingCase);
				return caseRepository.save(existingCase); // Save the updated case object
			} else {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Either caseId or userId is invalid");
			}

		} catch (Exception e) {
			LOG.error("Api.updateTicket({}, {}) => error!!!", input, e);
			throw e;
		}
	}

	@PostMapping("/chat/conversation/{chatId}")
	public ChatMessage addChatMessage(@PathVariable Long chatId, @RequestBody ChatMessageRequest message) {
		try {
			ChatMessage response = chatService.addChatMessage(chatId, message);
			LOG.info("Api.addChatMessage({}, {}) => {}", message, response);
			return response;
		} catch (Exception e) {
			LOG.error("Api.addChatMessage({}, {}) => error!!!", message, e);
			throw e;
		}
	}

	@GetMapping("/chat/conversation/{chatId}")
	public List<ChatMessage> getChatMessages(@PathVariable Long chatId) {
		try {
			List<ChatMessage> response = chatService.getChatMessages(chatId);
			LOG.info("Api.addChatMessage({}, {}) => {}", chatId, response);
			return response;
		} catch (Exception e) {
			LOG.error("Api.addChatMessage({}, {}) => error!!!", chatId, e);
			throw e;
		}
	}

	@PostMapping("/{contentType}/feedback/{contentId}")
	@PreAuthorize("hasAuthority('PLAYER')")
	public Feedback saveFeedback(@PathVariable Long contentId, @PathVariable String contentType,
			@RequestBody FeedbackRequest request) throws Exception {
		try {
			Optional<Case> caseResp = Optional.empty();
			Optional<Chat> chatResp = Optional.empty();
			Feedback response = null;

			if (FeedbackCategory.valueOf(contentType) == FeedbackCategory.CASE) {
				caseResp = caseRepository.findById(contentId);
				if (caseResp.isEmpty()) {
					LOG.warn("Case not found for contentId: {}", contentId);
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found");
				}
				// Feedback existingFeedback = feedbackRepo.findByCaseId(contentId);
				// Update or create feedback for CASE
				response = chatService.providePostResolutionFeedback(request, caseResp.orElse(null), null,
						null);
			} else if (FeedbackCategory.valueOf(contentType) == FeedbackCategory.CHAT) {
				chatResp = chatRepository.findById(contentId);
				if (chatResp.isEmpty()) {
					LOG.warn("Chat not found for contentId: {}", contentId);
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found");
				}
				// Feedback existingFeedback = feedbackRepo.findByChatId(contentId);
				// Update or create feedback for CHAT
				response = chatService.providePostResolutionFeedback(request, null, chatResp.orElse(null),
						null);
			} else {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid content type");
			}

			LOG.info("Api.saveFeedback({}, {}, {}) => {}", contentId, contentType, request, response);
			return response;

		} catch (Exception e) {
			LOG.error("Api.saveFeedback({}, {}, {}) => error!!!", contentId, contentType, request, e);
			throw e;
		}
	}

	@PostMapping("/case/{contentId}/{description}")
	@PreAuthorize("hasAnyAuthority('ADMIN','USER')")
	public Case createCase(@PathVariable Long contentId, @PathVariable String description) throws Exception {
		try {
			Case response = chatService.createSupportCaseByChatId(contentId, description);
			LOG.info("Api.createCase({}, {}, {}) => {}", contentId, description, response);
			return response;
		} catch (Exception e) {
			LOG.error("Api.createCase({}, {}, {}) => error!!!", contentId, description, e);
			throw e;
		}
	}

	@GetMapping("/case")
	@PreAuthorize("hasAnyAuthority('ADMIN','USER', 'PLAYER')")
	public Case getCaseDataByCaseId(@RequestParam(required = false) Long caseId) {
		try {
			Optional<Case> response = caseRepository.findById(caseId);
			LOG.info("Api.getCaseDataByCaseId() => {}", response);
			return response.get();
		} catch (Exception e) {
			LOG.error("Api.getCaseDataByCaseId() => error!!!", e);
			throw e;
		}
	}

	@GetMapping("/{contentType}/feedback-content/{titleId}/{languageId}")
	@PreAuthorize("hasAuthority('PLAYER')")
	public FeedbackContent getFeedbackQuestionsAndAnswers(
			@PathVariable("contentType") Feedback.FeedbackCategory contentType, @PathVariable("titleId") Long titleId,
			@PathVariable("languageId") Long languageId) {
		try {
			FeedbackContent response = chatService.getQAByTitleAndLanguage(contentType, titleId, languageId);
			LOG.info("Api.getFeedbackQuestionsAndAnswers() => {}", response);
			return response;
		} catch (Exception e) {
			LOG.error("Api.getFeedbackQuestionsAndAnswers() => error!!!", e);
			throw e;
		}
	}

	@GetMapping("/allCases")
	@PreAuthorize("hasAnyAuthority('ADMIN','USER')")
	public List<Case> getAllCases() {
		try {
			List<Case> response = caseRepository.findAll();
			List<Case> sortedResponse = response.stream().sorted((c1, c2) -> c1.getId().compareTo(c2.getId()))
					.collect(Collectors.toList());
			LOG.info("Api.getAllCases() => {}", response);
			return sortedResponse;
		} catch (Exception e) {
			LOG.error("Api.getAllCases() => error!!!", e);
			throw e;
		}
	}

	@GetMapping("v2/chat/player/{playerId}")
	public Chat getLastChatByPlayerId(@PathVariable Long playerId) {
		try {
			Chat chat = chatRepository.getLastChatByPlayerId(playerId);
			LOG.info("Api.getLastChatByPlayerId({}) => {}", playerId, chat);
			return chat;
		} catch (Exception e) {
			LOG.error("Api.getLastChatByPlayerId({}, {}) => error!!!", playerId, e);
			throw e;
		}
	}

	@GetMapping("/{contentType}/feedback/{id}")
	public Feedback getFeedbackByCategoryAndId(@PathVariable("contentType") Feedback.FeedbackCategory contentType,
			@PathVariable("id") Long id) {
		try {
			Feedback feedback = null;
			if (contentType == Feedback.FeedbackCategory.CASE) {
				feedback = feedbackRepo.findByCaseId(id);
			} else if (contentType == Feedback.FeedbackCategory.CHAT) {
				feedback = feedbackRepo.findByChatId(id);
			}
			if (feedback == null) {
				// If feedback is found for the specified content type, return 404
				throw new ResponseStatusException(HttpStatus.NOT_FOUND,
						"Feedback does not exists for the specified content");
			}
			LOG.info("Api.getFeedbackByCategoryAndId({}, {}) => {}", contentType, id, feedback);
			return feedback;
		} catch (Exception e) {
			LOG.error("Api.getFeedbackByCategoryAndId({}, {}) => error!!!", e);
			throw e;
		}
	}

	@PostMapping("/feedback")
	@PreAuthorize("hasAuthority('ADMIN')")
	public FeedbackContent saveFeedbackContent(@RequestBody FeedbackContentRequest request) throws Exception {
		try {

			FeedbackContent content = new FeedbackContent();
			content.setFeedbackCategory(request.getFeedbackCategory());
			content.setContent(request.getQaContent());
			content.setTitle(request.getTitleId());
			content.setPreferredLanguage(request.getLanguageId());
			content.setPlatform(1l);
			return feedbackContentRepo.save(content);

		} catch (Exception e) {
			LOG.error("Api.saveFeedback({}, {}, {}) => error!!!", request, e);
			throw e;
		}
	}
}
