package com.example.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.chatbot.entity.Player;

public interface PlayerRepository extends JpaRepository<Player, Long>{
   
}
