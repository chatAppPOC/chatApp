package com.activision.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.activision.chatbot.entity.Language;

public interface LanguageRepository extends JpaRepository<Language, Long> {

}
