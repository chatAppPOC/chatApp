package com.example.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.chatbot.entity.Case;

public interface CaseRepository extends JpaRepository<Case, Long> {
}
