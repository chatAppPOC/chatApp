package com.activision.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.activision.chatbot.entity.Title;

public interface TitleRepository extends JpaRepository<Title, Long> {

}
