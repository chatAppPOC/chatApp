package com.example.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.chatbot.entity.Chat;

@Repository
public interface ChatRepo extends JpaRepository<Chat, Integer>{
	@Query("""
			SELECT c FROM Chat c WHERE c.userId = :userId AND c.status = 'IN_PROGRESS'
					""")
	Chat getExistingChat(String userId);

}