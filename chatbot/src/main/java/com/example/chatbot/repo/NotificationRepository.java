package com.example.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.chatbot.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

}