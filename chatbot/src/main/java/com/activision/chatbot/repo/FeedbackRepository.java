package com.activision.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.activision.chatbot.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

	Feedback findByCaseId(Long caseId);

	Feedback findByChatId(Long chatId);
}
