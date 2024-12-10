package com.example.chatbot.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.chatbot.entity.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long>{
	@Query("""
			SELECT c FROM Chat c WHERE c.playerId = :playerId AND c.id = :id
					""")
	Chat getExistingChat(Long playerId, Long id);

	Optional<Chat> findById(Long Id);
}