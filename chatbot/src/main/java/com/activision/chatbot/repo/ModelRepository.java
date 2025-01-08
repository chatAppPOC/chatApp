package com.activision.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.activision.chatbot.entity.Model;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {
    
}
