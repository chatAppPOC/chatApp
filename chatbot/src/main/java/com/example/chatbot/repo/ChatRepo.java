package com.example.chatbot.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.chatbot.entity.ChatContent;

public interface ChatRepo extends JpaRepository<ChatContent, Integer> {

	@Query("""
			SELECT c FROM ChatWorkFlow c WHERE c.parentId = :id
					""")
	List<ChatContent> getAllQuestionAndAnswers(@Param("id") Integer id);
}
