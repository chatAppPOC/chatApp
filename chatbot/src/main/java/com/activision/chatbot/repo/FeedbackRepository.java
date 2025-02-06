package com.activision.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.activision.chatbot.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

	@Query(value = "select * from feedback where case_id = ?1 order by id desc LIMIT 1", nativeQuery = true)
	Feedback findByCaseId(Long caseId);

	@Query(value = "select * from feedback where chat_id = ?1 order by id desc LIMIT 1", nativeQuery = true)
	Feedback findByChatId(Long chatId);
}
