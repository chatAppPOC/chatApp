package com.example.springbootappwithh2database.service.impl;

import java.time.Instant;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springbootappwithh2database.entity.ChatAudit;
import com.example.springbootappwithh2database.entity.ChatWorkFlow;
import com.example.springbootappwithh2database.repo.ChatRepo;
import com.example.springbootappwithh2database.repo.ChatWorkFlowAuditRepo;
import com.example.springbootappwithh2database.service.ChatService;


@Service
public class ChatServiceImpl implements ChatService {

	private static final Logger  LOG = LoggerFactory.getLogger(ChatServiceImpl.class);
	
    @Autowired
    private ChatRepo repo;
    
    @Autowired 
    ChatWorkFlowAuditRepo auditRepo;

    @Override
    public ChatWorkFlow getChatDetailsById(int id) {
        return repo.findById(id).get();
    }

    @Override
    public ChatWorkFlow insertChatData(ChatWorkFlow request) {
        return repo.save(request);
    }
    
	@Override
	@Transactional
	public List<ChatWorkFlow> getAllQuestionAndAnswers(Integer questionId, String userId, String description) throws Exception {
		try {
			List<ChatWorkFlow> chatWorkFlows = repo.getAllQuestionAndAnswers(questionId);	
			Set<Integer> questions = new LinkedHashSet<>();
	        Set<Integer> answers = new LinkedHashSet<>();   
	        chatWorkFlows.stream()
            .filter(ques -> "Question".equalsIgnoreCase(ques.getContentType()) || "Answer".equalsIgnoreCase(ques.getContentType()))
            .forEach(res -> {
                if ("Question".equalsIgnoreCase(res.getContentType())) {
                    questions.add(res.getId());
                } else if ("Answer".equalsIgnoreCase(res.getContentType())) {
                    answers.add(res.getId());
                }
            });
			
			ChatAudit audit = auditRepo.findByUserId(userId);
			if (audit != null && audit.getId() != null) {
				audit.getQuestions().addAll(questions);
	            audit.getAnswers().addAll(answers);
				audit.setUpdatedOn(Instant.now());
				audit.setDescription(description);
			} else {
				audit = new ChatAudit(userId, new HashSet<>(questions), new HashSet<>(answers),
						description, Instant.now(), Instant.now());
			}
			auditRepo.save(audit);
			LOG.debug("ChatService.getAllQuestionAndAnswers({}) => {}", questionId, chatWorkFlows);
			return chatWorkFlows;
		} catch (Exception e) {
			LOG.error("ChatService.getAllQuestionAndAnswers({}) => error!!!", questionId, e);
			throw e;
		}
	}	
	
}
