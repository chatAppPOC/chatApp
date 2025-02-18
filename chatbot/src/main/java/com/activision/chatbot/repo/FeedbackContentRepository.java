package com.activision.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.activision.chatbot.entity.Feedback;
import com.activision.chatbot.entity.FeedbackContent;

public interface FeedbackContentRepository extends JpaRepository<FeedbackContent, Long>{

	@Query(value = """
			SELECT u.id, u.content, u.feedback_category, u.title, u.preferred_language, u.platform FROM feedback_content u
			 WHERE u.feedback_category = :feedbackCategory AND u.title = :titleId AND u.preferred_language = :preferredLanguage limit 1
			""", nativeQuery = true)
	FeedbackContent findByTitleIdAndLanguageId(String feedbackCategory, Long titleId, Long preferredLanguage);
}
