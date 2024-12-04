package com.example.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.Chat;

@Repository
public interface ChatAuditRepo extends JpaRepository<Chat, Integer>{
	
	Chat findByUserId(String userId);


}