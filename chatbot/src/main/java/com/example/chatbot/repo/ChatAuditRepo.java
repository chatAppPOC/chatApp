package com.example.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.chatbot.entity.ChatAudit;

@Repository
public interface ChatAuditRepo extends JpaRepository<ChatAudit, Integer>{
	
	ChatAudit findByUserId(String userId);


}