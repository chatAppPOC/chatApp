package com.example.chatbot.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.chatbot.dto.ChatMessageRequest;
import com.example.chatbot.dto.ChatRequest;
import com.example.chatbot.dto.ChatResponse;
import com.example.chatbot.entity.Case;
import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.entity.ChatMessage;
import com.example.chatbot.entity.ChatMessage.Message;
import com.example.chatbot.entity.Player;
import com.example.chatbot.entity.User;
import com.example.chatbot.repo.CaseRepository;
import com.example.chatbot.repo.ChatContentRepository;
import com.example.chatbot.repo.ChatMessageRepository;
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
    
    @Autowired
    ChatMessageRepository chatMessageRepository;
    
    public ChatContent insertChatData(ChatContent request) {
        return chatContentRepository.save(request);
    }
    
	@Transactional
	public ChatResponse getAllQuestionAndAnswers(ChatRequest input) throws Exception {
		try {
			
			List<ChatContent> chatContent = input.getChatId() == null ? 
					chatContentRepository.firstSetOfContent(input.getLanguageId())
					: chatContentRepository.nextSetOfContent(input.getAnswerId(), input.getLanguageId());	
			
			Chat chat = null;
			if(input.getChatId() == null) {
				chat = new Chat(input.getPlayerId(), "IN_PROGRESS");
			}
			else{
				chat = chatRepository.getExistingChat(input.getPlayerId(), input.getChatId());
				if (chat != null && chat.getId() != null) {
					if(input.getQuestionId() != null)
						chat.getQuestions().add(input.getQuestionId());
					if(input.getDescription() != null) {
						chat.setDescription(input.getDescription());
						createSupportCaseByChatId(input.getChatId());
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
			if(chat.isPresent()) {
				Optional<Player> player = playerRepo.findById(chat.get().getPlayerId());
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
}
