package com.example.chatbot.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.chatbot.dto.ChatMessageRequest;
import com.example.chatbot.dto.ChatRequestv2;
import com.example.chatbot.dto.ChatResponsev2;
import com.example.chatbot.dto.FeedbackRequest;
import com.example.chatbot.entity.Case;
import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.Chat.ChatStatus;
import com.example.chatbot.entity.ChatMessage;
import com.example.chatbot.entity.Feedback;
import com.example.chatbot.entity.Feedback.FeedbackCategory;
import com.example.chatbot.entity.FeedbackContent;
import com.example.chatbot.entity.FeedbackResp;
import com.example.chatbot.entity.FeedbackResp.Answer;
import com.example.chatbot.entity.Player;
import com.example.chatbot.entity.Title;
import com.example.chatbot.entity.User;
import com.example.chatbot.model.Message;
import com.example.chatbot.model.Message.Source;
import com.example.chatbot.repo.CaseRepository;
import com.example.chatbot.repo.ChatContentRepository;
import com.example.chatbot.repo.ChatMessageRepository;
import com.example.chatbot.repo.ChatRepository;
import com.example.chatbot.repo.FeedbackContentRepository;
import com.example.chatbot.repo.FeedbackRepository;
import com.example.chatbot.repo.PlayerRepository;
import com.example.chatbot.repo.TitleRepository;
import com.example.chatbot.repo.UserRepository;

@Service
public class ChatService {

	private static final Logger LOG = LoggerFactory.getLogger(ChatService.class);

	
	private static final String CASE_MESSAGE = "Support case has been created with ID : ";
	
	private static final String GREETINGS = "Thank you for contacting us. Have a nice day !";

	

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

	@Autowired
	TitleRepository titleRepo;

	@Autowired
	FeedbackContentRepository feedbackContentRepo;

	@Autowired
	private JavaMailSender javaMailSender;

	@Value("$(spring.mail.username)")
	private String fromMailId;	

	@Transactional
	public ChatResponsev2 performChatv2(ChatRequestv2 request) throws Exception {
		try {
			Chat chat = null;
			Case newCase = null;
			ChatResponsev2 chatMessages = new ChatResponsev2();
			
			boolean contentTypeExists = request.getMessage() != null && request.getMessage().getContentType() != null;
            boolean isDescription = contentTypeExists && request.getMessage().getContentType().equals("Description");
            boolean isSolution = contentTypeExists && request.getMessage().getContentType().equals("Solution");
            
			if (request.getChatId() == null) {
				chat = new Chat(request.getPlayerId());
			} else {
				chat = chatRepository.getExistingChatInProgress(request.getPlayerId(), request.getChatId());
				if(contentTypeExists) {
					if (isDescription) {
						chat.setDescription(request.getMessage().getContent());
						newCase = createSupportCaseByChatId(request.getChatId(), request.getMessage().getContent());
						if (newCase != null) {
							chatMessages.setMessage(CASE_MESSAGE + newCase.getId());
						}
						chat.setStatus(ChatStatus.CASE_CREATED);
					}

					if (isSolution) {
						chat.setStatus(ChatStatus.COMPLETE);
						chatMessages.setMessage(GREETINGS);
					}
				}
				chat.setUpdatedOn(Instant.now());
			}
			
			Message msg = request.getMessage();
			msg.setTimestamp(Instant.now());
			chat.getMessages().add(msg);
			
			if(contentTypeExists) {
				Message lastMsg = new Message();
				if(isDescription)
					lastMsg.setContent(CASE_MESSAGE + newCase.getId());
				if(isSolution)
					lastMsg.setContent(GREETINGS);
				lastMsg.setTimestamp(Instant.now());
				lastMsg.setSource(Source.BOT);
				chat.getMessages().add(lastMsg);
			}
			
			Chat savedChat = chatRepository.save(chat);
			chatMessages.setChatId(savedChat.getId());
			LOG.debug("ChatService.performChatv2({}) => {}", request, chatMessages);
			return chatMessages;
		} catch (Exception e) {
			LOG.error("ChatService.performChatv2({}) => error!!!", request);
			throw e;
		}

	}

	@Transactional
	public Page<Chat> getChatHistory(Long playerId, int page, int size) {
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<Chat> result = chatRepository.findAllByPlayerId(playerId, pageable);
			LOG.debug("ChatService.getChatHistory({}, {}, {}) => {}", playerId, page, size, result);
			return result;
		}
		catch(Exception e) {
			LOG.error("ChatService.getChatHistory({}, {}, {}) => error!!!", playerId, page, size);
			throw e;
		}
	}

	@Transactional

	public Case createSupportCaseByChatId(Long chatId, String caseType) throws Exception {
		try {
			Optional<Chat> chat = chatRepository.findById(chatId);
			Case newCase = null;
			if (chat.isPresent()) {
				Optional<Player> player = playerRepository.findById(chat.get().getPlayerId());
				Optional<Title> title = titleRepo.findById(player.get().getTitle());
				User assignedUser = userRepository.fetchUserByLanguageAndPlatformAndTitle(
						player.get().getPreferredLanguage(), player.get().getPlatform(), player.get().getTitle());
				if (assignedUser != null) {
					String fullName = assignedUser.getFirstName() + " " + assignedUser.getLastName();
					newCase = new Case(assignedUser.getId(), chat.get().getId(), caseType, null, fullName,
							title.get().getName());
				}
			} else {
				LOG.warn("ChatService.createSupportCaseByChatId({}) => ChatId does not exist", chatId);
			}
			Case response = caseRepository.save(newCase);
			LOG.debug("ChatService.createSupportCaseByChatId({}, {}) => {}", chatId, caseType, response);
			return response;
		} catch (Exception e) {
			LOG.error("ChatService.createSupportCaseByChatId({}, {}) => error!!!", chatId, caseType, e);
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
				LOG.debug("ChatService.addChatMessage({}) => {}", chatId, addedMessage);
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

	@Transactional
	public Feedback providePostResolutionFeedback(FeedbackRequest request, Case caseReq, Chat chatReq) {
		try {
			Feedback feedback = null;
			Long totalScore = request.getScores().stream().mapToLong(Long::longValue).sum();

			if (caseReq != null && caseReq.getId() != null) {
				feedback = new Feedback(null, caseReq.getId(), FeedbackCategory.CASE, request.getQuestionAndAnswer(),
						request.getIssueResolved(), request.getSatisfiedWithSupport(), totalScore);
			} else if (chatReq != null && chatReq.getId() != null) {
				feedback = new Feedback(chatReq.getId(), null, FeedbackCategory.CHAT, request.getQuestionAndAnswer(),
						request.getIssueResolved(), request.getSatisfiedWithSupport(), totalScore);
			} else {
				LOG.warn("No valid caseReq or chatReq provided. Unable to create feedback.");
				throw new IllegalArgumentException("Either caseReq or chatReq must be provided.");
			}

			// Save feedback to the repository
			Feedback response = feedbackRepo.save(feedback);

			// Send email notification
			SimpleMailMessage mailMessage = new SimpleMailMessage();
			mailMessage.setTo("Sandeepkv.3535@gmail.com");
			mailMessage.setFrom(fromMailId);
			mailMessage.setText(response.toString());
			mailMessage.setSubject("Java Mail Testing");
			LOG.info("ChatService.providePostResolutionFeedback(email with subject: {}) sent sucessfully to  => {}", response.toString(), "Sandeepkv.3535@gmail.com");
			javaMailSender.send(mailMessage);
			LOG.debug("ChatService.providePostResolutionFeedback({}, {}, {}) => {}", request, caseReq, chatReq,
					response);
			return response;

		} catch (Exception e) {
			LOG.error("ChatService.providePostResolutionFeedback({}, {}, {}) => error!!!", request, caseReq, chatReq,
					e);
			throw e;
		}
	}

	@Transactional
	public List<FeedbackResp> getQuestionsAndAnswers() {
		try {
			List<FeedbackContent> questions = feedbackContentRepo.findByContentType("Question"); // fetch all questions
			return questions.stream().map(question -> {
				List<FeedbackContent> answers = feedbackContentRepo.findAnswerByParentId(question.getId());
				List<Answer> answer = answers.stream().map(x -> {
					Answer answerResp = new Answer();
					answerResp.setId(x.getId());
					answerResp.setContent(x.getContent());
					answerResp.setScore(x.getScore());
					return answerResp;
				}).collect(Collectors.toList());

				FeedbackResp questionAndAnswers = new FeedbackResp();
				questionAndAnswers.setId(question.getId());
				questionAndAnswers.setContent(question.getContent());
				questionAndAnswers.setContentType(question.getContentType());
				questionAndAnswers.setModelId(question.getModelId());
				questionAndAnswers.setAnswers(answer);
				return questionAndAnswers;
			}).collect(Collectors.toList());
		} catch (Exception e) {
			LOG.error("ChatService.getQuestionsAndAnswers({}) => error!!!", e);
			throw e;
		}
	}
}
