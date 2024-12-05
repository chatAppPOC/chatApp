package com.example.chatbot.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.chatbot.entity.ChatContent;

public interface ChatContentRepo extends JpaRepository<ChatContent, Integer> {

	@Query("""
			SELECT c FROM ChatContent c WHERE c.parentId = :id
					""")
	List<ChatContent> getQuestionAndAnswers(@Param("id") Integer id);
}
