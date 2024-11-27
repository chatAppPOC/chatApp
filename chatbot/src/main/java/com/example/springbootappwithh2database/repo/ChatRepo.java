package com.example.springbootappwithh2database.repo;

import com.example.springbootappwithh2database.entity.ChatWorkFlow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepo extends JpaRepository<ChatWorkFlow , Integer> {
}
