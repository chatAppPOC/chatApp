package com.example.springbootappwithh2database.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.springbootappwithh2database.entity.ChatAudit;

@Repository
public interface ChatWorkFlowAuditRepo extends JpaRepository<ChatAudit, Integer>{
	
	ChatAudit findByUserId(String userId);


}
