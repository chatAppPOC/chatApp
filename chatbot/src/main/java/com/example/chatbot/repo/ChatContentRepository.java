package com.example.chatbot.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.chatbot.entity.ChatContent;

public interface ChatContentRepository extends JpaRepository<ChatContent, Integer> {
	
	@Query(value = "WITH Q as(\r\n"
			+ "			SELECT *\r\n"
			+ "			FROM chat_content\r\n"
			+ "			WHERE parent_id IS NULL AND language_id = ?1)\r\n"
			+ "			SELECT A.id, A.content, A.content_type, A.parent_id, A.language_id\r\n"
			+ "			FROM chat_content A, Q\r\n"
			+ "			WHERE A.parent_id = Q.id AND A.language_id = ?1\r\n"
			+ "			UNION\r\n"
			+ "			SELECT * FROM Q\r\n"
			+ "			ORDER BY id", nativeQuery = true) 
	List<ChatContent> firstSetOfContent(@Param("languageId") Long languageId);
	
	@Query(value = "WITH Q as(\r\n"
			+ "			SELECT *\r\n"
			+ "			FROM chat_content\r\n"
			+ "			WHERE parent_id = ?1 AND language_id = ?2)\r\n"
			+ "			SELECT A.id, A.content, A.content_type, A.parent_id, A.language_id\r\n"
			+ "			FROM chat_content A, Q\r\n"
			+ "			WHERE A.parent_id = Q.id AND A.language_id = ?2\r\n"
			+ "			UNION\r\n"
			+ "			SELECT * FROM Q\r\n"
			+ "			ORDER BY id", nativeQuery = true) 
	List<ChatContent> nextSetOfContent(@Param("id") Long id, @Param("languageId") Long languageId);
	
	Optional<ChatContent> findById(Long id);
	
	List<ChatContent> findByIdIn(List<Long> ids);
}
