package com.example.chatbot.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.chatbot.dto.ChatHistoryResponse;
import com.example.chatbot.dto.ChatRequest;
import com.example.chatbot.dto.ChatResponse;
import com.example.chatbot.entity.Case;
import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.entity.Player;
import com.example.chatbot.entity.User;
import com.example.chatbot.repo.CaseRepository;
import com.example.chatbot.repo.ChatContentRepository;
import com.example.chatbot.repo.ChatRepository;
import com.example.chatbot.repo.PlayerRepo;
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

	@Autowired
	PlayerRepo playerRepo;

	public ChatContent insertChatData(ChatContent request) {
		return chatContentRepository.save(request);
	}

	@Transactional
	public ChatResponse getAllQuestionAndAnswers(ChatRequest input) throws Exception {
		try {

			List<ChatContent> chatContent = input.getChatId() == null
					? chatContentRepository.firstSetOfContent(input.getLanguageId())
					: chatContentRepository.nextSetOfContent(input.getAnswerId(), input.getLanguageId());

			Chat chat = null;
			if (input.getChatId() == null) {
				chat = new Chat(input.getPlayerId(), "IN_PROGRESS");
			} else {
				chat = chatRepository.getExistingChat(input.getPlayerId(), input.getChatId());
				if (chat != null && chat.getId() != null) {
					if (input.getQuestionId() != null)
						chat.getQuestions().add(input.getQuestionId());
					if (input.getDescription() != null) {
						chat.setDescription(input.getDescription());
						createSupportCaseByChatId(input.getChatId());
						chat.setStatus("CASE_CREATED");
					} else if (input.getAnswerId() != null) {
						chat.getAnswers().add(input.getAnswerId());
					}
					chat.setUpdatedOn(Instant.now());
				}
			}

			if (chatContent != null && chatContent.isEmpty() && input.getDescription() == null) {
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
	public Case createSupportCaseByChatId(Long chatId) throws Exception {
		try {
			Optional<Chat> chat = chatRepository.findById(chatId);
			Case newCase = null;
			if (chat.isPresent()) {
				Optional<Player> player = playerRepo.findById(chat.get().getPlayerId());
				User assignedUser = userRepository.fetchUserByLanguageAndPlatformAndTitle(
						player.get().getPreferredLanguage(), player.get().getPlatform(), player.get().getTitle());
				if (assignedUser != null) {
					newCase = new Case(assignedUser.getId(), chat.get().getId());
				}
			} else {
				LOG.warn("ChatService.createSupportCaseByChatId({}) => ChatId does not exist", chatId);
			}
			Case response = caseRepository.save(newCase);
			LOG.debug("ChatService.createSupportCaseByChatId({}) => {}", chatId, response);
			return response;
		} catch (Exception e) {
			LOG.error("ChatService.createSupportCaseByChatId({}) => error!!!", chatId, e);
			throw e;
		}
	}

	public List<ChatHistoryResponse> getChatHistory(Long playerId) {
		try {
		List<Chat> chatList = chatRepository.findByPlayerId(playerId);
		List<ChatHistoryResponse> response = new ArrayList<ChatHistoryResponse>();
		if(!chatList.isEmpty() && chatList!=null) {
		for (Chat chat : chatList) {

			ChatHistoryResponse chatHistoryResponse = new ChatHistoryResponse();
			chatHistoryResponse.setChatId(chat.getId());
			chatHistoryResponse.setStatus(chat.getStatus());

			List<ChatHistoryResponse.Message> messages = new ArrayList<>();
			List<Long> allContentIds = new ArrayList<>();
			allContentIds.addAll(chat.getQuestions());
			allContentIds.addAll(chat.getAnswers());

			List<ChatContent> chatContents = chatContentRepository.findByIdIn(allContentIds);
			Map<Long, ChatContent> contentMap = chatContents.stream()
					.collect(Collectors.toMap(ChatContent::getId, content -> content));
			List<Long> questionIds = chat.getQuestions();
			List<Long> answerIds = chat.getAnswers();
			int questionIndex = 0, answerIndex = 0;

			while (questionIndex < questionIds.size() || answerIndex < answerIds.size()) {
				if (questionIndex < questionIds.size()) {
					ChatContent questionContent = contentMap.get(questionIds.get(questionIndex));
					if (questionContent != null) {
						ChatHistoryResponse.Message message = new ChatHistoryResponse.Message();
						message.setContent(questionContent.getContent());
						message.setSource("BOT");
						messages.add(message);
					}
					questionIndex++;
				}

				if (answerIndex < answerIds.size()) {
					ChatContent answerContent = contentMap.get(answerIds.get(answerIndex));
					if (answerContent != null) {
						ChatHistoryResponse.Message message = new ChatHistoryResponse.Message();
						message.setContent(answerContent.getContent());
						message.setSource("PLAYER");
						messages.add(message);
					}
					answerIndex++;
				}
			}

			chatHistoryResponse.setMessages(messages);
			response.add(chatHistoryResponse);
		}
		
		} else {
			LOG.warn("ChatService.getChatHistory({}) => Chat History does not exist", playerId);
		}

		return response;
		} catch (Exception e) {
			LOG.error("ChatService.getChatHistory({}) => error!!!", playerId, e);
			throw e;
		}
	}
}
