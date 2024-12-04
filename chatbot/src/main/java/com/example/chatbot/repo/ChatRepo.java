package com.example.chatbot.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.chatbot.entity.ChatWorkFlow;

public interface ChatRepo extends JpaRepository<ChatWorkFlow, Integer> {

	@Query("""
			SELECT c FROM ChatWorkFlow c WHERE c.parentId = :id
					""")
	List<ChatWorkFlow> getAllQuestionAndAnswers(@Param("id") Integer id);
}
