package com.activision.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.activision.chatbot.entity.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {

}
