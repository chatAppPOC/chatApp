package com.example.chatbot.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import com.example.chatbot.entity.Content;

public interface ContentRepository extends JpaRepository<Content, Long>{
   
	@Query(value = "SELECT * FROM content\r\n"
			+ "WHERE language_id = ?1", nativeQuery = true) 
	List<Content> findAllByLanguageId(Long languageId);
}
