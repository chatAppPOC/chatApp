package com.activision.chatbot.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.activision.chatbot.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

	List<Feedback> findByCaseId(Long caseId);

	List<Feedback> findByChatId(Long chatId);
}
