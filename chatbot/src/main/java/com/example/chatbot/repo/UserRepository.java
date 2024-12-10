package com.example.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.chatbot.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

}