package com.example.chatbot.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.chatbot.dto.CaseFeedbackRequest;
import com.example.chatbot.dto.ChatMessageRequest;
import com.example.chatbot.dto.ChatRequest;
import com.example.chatbot.dto.ChatResponse;
import com.example.chatbot.entity.Case;
import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.entity.ChatMessage;
import com.example.chatbot.entity.Feedback;
import com.example.chatbot.entity.Player;
import com.example.chatbot.entity.User;
import com.example.chatbot.model.Message;
import com.example.chatbot.repo.CaseRepository;
import com.example.chatbot.repo.ChatContentRepository;
import com.example.chatbot.repo.ChatMessageRepository;
import com.example.chatbot.repo.ChatRepository;
import com.example.chatbot.repo.FeedbackRepository;
import com.example.chatbot.repo.PlayerRepository;
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
    PlayerRepository playerRepository;
    
    @Autowired
    ChatMessageRepository chatMessageRepository;
   
    @Autowired
    FeedbackRepository feedbackRepo;
   
	@Transactional
	public ChatResponse performChat(ChatRequest request) throws Exception{
		try {
			
			Long optionId = 0L;
			String description = "";
			List<ChatContent> chatContent = new ArrayList<>();
			Optional<Message> answer = request.getMessages().stream()
					             .filter(msg -> msg.getSource().equals("PLAYER"))
					             .findFirst();
			if(answer.isPresent()) {
				optionId = answer.get().getContentId();
				description = answer.get().getContent();
				chatContent = request.getChatId() == null ? 
						chatContentRepository.firstSetOfContent(request.getModelId())
						: chatContentRepository.nextSetOfContent(optionId, request.getModelId());	
			}
			
			Chat chat = null;
			Case newCase = null;
			ChatResponse chatMessages = new ChatResponse();

			if(request.getChatId() == null) {
				chat = new Chat(request.getPlayerId(), "IN_PROGRESS");
				chat.getMessages().addAll(request.getMessages());
			}
			else if(request.getMessages().size() > 1){
				chat = chatRepository.getExistingChatInProgress(request.getPlayerId(), request.getChatId());
				if (chat != null && chat.getId() != null) {
					chat.getMessages().addAll(request.getMessages());
					if(optionId == null && !description.isEmpty()) {
						chat.setDescription(description);
						chatMessages.setCaseId(1L);
						newCase = createSupportCaseByChatId(request.getChatId());
//						if(newCase != null) {
//						chatMessages.setCaseId(newCase.getId());
//					}
						chat.setStatus("CASE_CREATED");
					}
					chat.setUpdatedOn(Instant.now());
	 		    } 
			}
			else{
				chat = chatRepository.getExistingChat(request.getPlayerId(), request.getChatId());
				if (chat != null && chat.getId() != null) {
					chat.getMessages().addAll(request.getMessages());
					if(chat.getStatus().equals("IN_PROGRESS")) {
						chat.setStatus("COMPLETE");
					}		
				}	
			}
						
			Chat savedChat = chatRepository.save(chat);
			chatMessages.setChatId(savedChat.getId());
			chatMessages.setOptions(chatContent);
			
			LOG.debug("ChatService.getAllQuestionAndAnswers({}) => {}", optionId, chatMessages);
			return chatMessages;
		} catch (Exception e) {
			LOG.error("ChatService.getAllQuestionAndAnswers({}) => error!!!", e);
			throw e;
		}
	}
	
	@Transactional
	public Page<Chat> getChatHistory(Long playerId, int page, int size) {		
		 Pageable pageable = PageRequest.of(page, size);
	     return chatRepository.findAllByPlayerId(playerId, pageable);
	}

	@Transactional
	public Case createSupportCaseByChatId(Long chatId) throws Exception {
		try {
			Optional<Chat> chat = chatRepository.findById(chatId);
			Case newCase = null;
			if(chat.isPresent()) {
				Optional<Player> player = playerRepository.findById(chat.get().getPlayerId());
				User assignedUser = userRepository.fetchUserByLanguageAndPlatformAndTitle(player.get().getPreferredLanguage(), 
						player.get().getPlatform(), player.get().getTitle());
				if(assignedUser != null) {
					newCase = new Case(assignedUser.getId(), chat.get().getId());
				}
			} else {
				LOG.warn("ChatService.createSupportCaseByChatId({}) => ChatId does not exist", chatId);
			}
			Case response = caseRepository.save(newCase);
			LOG.debug("ChatService.createSupportCaseByChatId({}) => {}", chatId,  response);
			return response;
		} catch (Exception e) {
			LOG.error("ChatService.createSupportCaseByChatId({}) => error!!!", chatId, e);
			throw e;
		}
	}
	
	public ChatMessage addChatMessage(Long chatId, ChatMessageRequest messageRequest) {
		try {
			Optional<Chat> chat = chatRepository.findById(chatId);
			Optional<ChatMessage> mayBeChatMessages = chatMessageRepository.findById(chatId);
			if (chat.isPresent()) {
				ChatMessage chatMessages = new ChatMessage();
				chatMessages.setChatId(chatId);
				Message message = new Message();
				message.setContent(messageRequest.content);
				message.setSource(messageRequest.source);
				message.setTimestamp(Instant.now());
				message.setContentType(MediaType.TEXT_PLAIN.toString());
				List<Message> messageList = null;
				if (!mayBeChatMessages.isPresent()) {
					messageList = new ArrayList<Message>();
				} else {
					messageList = mayBeChatMessages.get().getMessages();
				}
				messageList.add(message);
				chatMessages.setMessages(messageList);
				ChatMessage addedMessage = chatMessageRepository.save(chatMessages);
				LOG.debug("ChatService.addChatMessage({}) => {}", chatId,  addedMessage);
			} else {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "chatId is invalid");
			}
		} catch (Exception e) {
			LOG.error("ChatService.addChatMessage({}) => error!!!", messageRequest, e);
			throw e;
		}
		return null;
	}

	public List<ChatMessage> getChatMessages(Long chatId) {
		try {
			Optional<Chat> chat = chatRepository.findById(chatId);
			if (chat.isPresent()) {
				List<ChatMessage> messages = chatMessageRepository.findByChatId(chatId);
				return messages;
			} else {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "chatId is invalid");
			}
		} catch (Exception e) {
			LOG.error("ChatService.getChatMessages({}) => error!!!", chatId, e);
			throw e;
		}
	}
	
	public Feedback providePostResolutionFeedback(CaseFeedbackRequest request, Case caseResp) {
		try {
			Optional<Chat> chat = chatRepository.findById(caseResp.getChatId());
			Feedback feedback = null;
			if (chat.isPresent()) {
				feedback = new Feedback(caseResp.getChatId(), caseResp.getId(), request.getPlayerFeedbackComments(), request.getIssueResolved(),
						request.getSatisfiedWithSupport(), request.getPlayerRating());
			}
			Feedback response = feedbackRepo.save(feedback);
			LOG.debug("ChatService.providePostResolutionFeedback({}) => {}", request, response);
			return response;
		} catch (Exception e) {
			LOG.error("ChatService.providePostResolutionFeedback({}) => error!!!", request, e);
			throw e;
		}
	}
}
