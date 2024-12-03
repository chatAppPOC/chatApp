package com.example.springbootappwithh2database.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.springbootappwithh2database.entity.ChatWorkFlow;

public interface ChatRepo extends JpaRepository<ChatWorkFlow, Integer> {

	@Query("""
			SELECT c FROM ChatWorkFlow c WHERE c.id = :id OR c.parentId = :id
					""")
	List<ChatWorkFlow> getAllQuestionAndAnswers(@Param("id") Integer id);
}
