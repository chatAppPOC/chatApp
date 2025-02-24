package com.activision.chatbot.service;

import java.time.Instant;
import java.time.LocalDate;
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
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.activision.chatbot.dto.ChatMessageRequest;
import com.activision.chatbot.dto.ChatRequestv2;
import com.activision.chatbot.dto.ChatResponsev2;
import com.activision.chatbot.dto.FeedbackRequest;
import com.activision.chatbot.dto.FeedbackResp;
import com.activision.chatbot.dto.FeedbackResp.Answer;
import com.activision.chatbot.dto.PlayerUserResponse;
import com.activision.chatbot.entity.Case;
import com.activision.chatbot.entity.Chat;
import com.activision.chatbot.entity.Chat.ChatStatus;
import com.activision.chatbot.entity.ChatMessage;
import com.activision.chatbot.entity.Feedback;
import com.activision.chatbot.entity.Feedback.FeedbackCategory;
import com.activision.chatbot.entity.FeedbackContent;
import com.activision.chatbot.entity.Player;
import com.activision.chatbot.exception.PlayerNotFoundException;
import com.activision.chatbot.model.Message;
import com.activision.chatbot.model.Message.Source;
import com.activision.chatbot.repo.CaseRepository;
import com.activision.chatbot.repo.ChatMessageRepository;
import com.activision.chatbot.repo.ChatRepository;
import com.activision.chatbot.repo.FeedbackContentRepository;
import com.activision.chatbot.repo.FeedbackRepository;
import com.activision.chatbot.repo.PlayerRepository;
import com.activision.chatbot.repo.TitleRepository;
import com.activision.chatbot.repo.UserRepository;

import jakarta.mail.internet.MimeMessage;

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
			
			Optional<Player> player = playerRepository.findById(request.getPlayerId());
			if(!player.isPresent()) {
				throw new PlayerNotFoundException("The player with id : "+ request.getPlayerId() +" is not found");
			}
			else {
				Chat chat = null;
				Case newCase = null;
				ChatResponsev2 chatMessages = new ChatResponsev2();
				
				boolean contentTypeExists = request.getMessage() != null && request.getMessage().getContentType() != null;
	            boolean isDescription = contentTypeExists && request.getMessage().getContentType().equalsIgnoreCase("Description");
	            boolean isSolution = contentTypeExists && request.getMessage().getContentType().equalsIgnoreCase("Solution");
	            
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
			}
			
		} catch (Exception e) {
			LOG.error("ChatService.performChatv2({}) => error!!!", request);
			throw e;
		}

	}

	
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
	
	
	public Chat getChat(Long chatId) {
		try {
			Optional<Chat> result = chatRepository.findById(chatId);
			if(result.isPresent()) {
				LOG.debug("ChatService.getChat({}) => {}", chatId, result.get());
				return result.get();
			}
			else{
				LOG.warn("ChatService.getChat({}) => ChatId does not exist", chatId);
				return (new Chat());
			}
		}
		catch(Exception e) {
			LOG.error("ChatService.getChat({}, {}, {}) => error!!!", chatId, e);
			throw e;
		}
	}

	@Transactional
	public Case createSupportCaseByChatId(Long chatId, String caseType) throws Exception {
		try {
			Optional<Chat> chat = chatRepository.findById(chatId);
			Case newCase = null;
			if (chat.isPresent()) {
				PlayerUserResponse assignedUser = playerRepository
						.fetchUserByLanguageAndPlatformAndTitle(chat.get().getPlayerId());
				if (assignedUser != null) {
					newCase = new Case(assignedUser.getUserId(), chat.get().getId(), caseType,
							assignedUser.getTitle());
				}
				else {
					Optional<Player> player = playerRepository.findById(chat.get().getPlayerId());
					newCase = new Case(chat.get().getId(), caseType, player.get().getTitle());
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
    
	@Transactional
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
	public Feedback providePostResolutionFeedback(FeedbackRequest request, Case caseReq, Chat chatReq,
			Feedback existingFeedback) throws Exception {
		try {
			Long averageScore = (long) (request.getQuestionAndAnswer().stream()
					.mapToLong(FeedbackRequest.QuestionAndAnswerReq::getScore).average()).orElse(0);
			Feedback feedback = (existingFeedback != null) ? existingFeedback : saveFeedback(request, caseReq, chatReq, Math.round(averageScore));
			if (caseReq != null && caseReq.getId() != null) {
				feedback.setCaseId(caseReq.getId());
				feedback.setFeedbackCategory(FeedbackCategory.CASE);
			} else if (chatReq != null && chatReq.getId() != null) {
				feedback.setChatId(chatReq.getId());
				feedback.setFeedbackCategory(FeedbackCategory.CHAT);
			} else {
				LOG.warn("No valid caseReq or chatReq provided. Unable to create feedback.");
				throw new IllegalArgumentException("Either caseReq or chatReq must be provided.");
			}

			// Update feedback fields
			feedback.setFeedback(request.getQuestionAndAnswer());
			if(request.getIssueResolved())
			feedback.setIssueResolved(request.getIssueResolved());
			else {
				Optional<Case> caseResp = caseRepository.findById(caseReq.getId());
				Case existingCase = caseResp.get();

				// Update the existing case with the new values
				existingCase.setUserId(caseReq.getUserId());
				existingCase.setCaseType(caseReq.getCaseType());
				existingCase.setCompletedOn(null);
				existingCase.setStatus(Case.CaseStatus.RE_OPENED);
				existingCase.setReopenedOn(LocalDate.now());
				existingCase.setTitle(caseReq.getTitle());

				// Save the updated case
				LOG.info("Api.updateTicket({}) => {}", existingCase);
				caseRepository.save(existingCase); // Save the updated case object
				feedback.setIssueResolved(request.getIssueResolved());
			}
			feedback.setAverageScore(Math.round(averageScore));
			feedback.setDescription(request.getPlayerFeedbackComments());

			// Save or update feedback in the repository
			Feedback response = feedbackRepo.save(feedback);

			String tableHtml = "<html><body>" + "<h3>Feedback Details</h3>"
					+ "<table border='1' style='border-collapse: collapse; width: 100%;'>"
					+ "<tr><th>Field</th><th>Value</th></tr>" + "<tr><td>Feedback ID</td><td>" + response.getId()
					+ "</td></tr>" + "<tr><td>chatId</td><td>" + response.getChatId() + "</td></tr>"
					+ "<tr><td>caseId</td><td>" + response.getCaseId() + "</td></tr>"
					+ "<tr><td>feedbackCategory ID</td><td>" + response.getFeedbackCategory() + "</td></tr>"
					+ "<tr><td>description</td><td>" + response.getDescription() + "</td></tr>"
					+ "<tr><td>feedback</td><td>" + response.getFeedback() + "</td></tr>"
					+ "<tr><td>issueResolved</td><td>" + response.getIssueResolved() + "</td></tr>"
					+ "<tr><td>averageScore</td><td>" + response.getAverageScore() + "</td></tr>"
					+ "<tr><td>createdOn</td><td>" + response.getCreatedOn() + "</td></tr>" + "</table>"
					+ "</body></html>";
			// Send email notification
			MimeMessage mailMessage = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mailMessage, true);
			helper.setTo("testjava0987@gmail.com");
			helper.setFrom(fromMailId);
			helper.setSubject("Java Mail Testing");
			helper.setText(tableHtml, true);
			LOG.info("ChatService.providePostResolutionFeedback(email with subject: {}) sent sucessfully to  => {}",
					response.toString());
			//javaMailSender.send(mailMessage);
			LOG.debug("ChatService.providePostResolutionFeedback({}, {}, {}) => {}", request, caseReq, chatReq,
					response);
			return response;

		} catch (Exception e) {
			LOG.error("ChatService.providePostResolutionFeedback({}, {}, {}) => error!!!", request, caseReq, chatReq,
					e);
			throw e;
		}
	}
	
	private Feedback saveFeedback(FeedbackRequest request, Case caseReq, Chat chatReq, int averageScore) {
		try {
			Feedback feedback = null;
			if (caseReq != null && caseReq.getId() != null) {
				feedback = new Feedback(null, caseReq.getId(), FeedbackCategory.CASE, request.getQuestionAndAnswer(),
						request.getIssueResolved(), Math.round(averageScore), request.getPlayerFeedbackComments());
			} else if (chatReq != null && chatReq.getId() != null) {
				feedback = new Feedback(chatReq.getId(), null, FeedbackCategory.CHAT, request.getQuestionAndAnswer(),
						request.getIssueResolved(), Math.round(averageScore), request.getPlayerFeedbackComments());
			} else {
				LOG.warn("No valid caseReq or chatReq provided. Unable to create feedback.");
				throw new IllegalArgumentException("Either caseReq or chatReq must be provided.");
			}
			return feedback;
		} catch (Exception e) {
			LOG.error("ChatService.providePostResolutionFeedback({}, {}, {}) => error!!!", request, caseReq, chatReq,
					e);
			throw e;
		}
	}

	public FeedbackContent getQAByTitleAndLanguage(Feedback.FeedbackCategory contentType, Long titleId, Long languageId ) {
		try {
			FeedbackContent feedbackQA = feedbackContentRepo.findByTitleIdAndLanguageId(contentType.toString(), titleId, languageId); // fetch all questions
			return feedbackQA;
		} catch (Exception e) {
			LOG.error("ChatService.getQuestionsAndAnswers({}) => error!!!", e);
			throw e;
		}
	}
}
