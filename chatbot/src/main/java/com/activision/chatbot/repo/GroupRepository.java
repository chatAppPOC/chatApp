package com.activision.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.activision.chatbot.entity.Group;
import com.activision.chatbot.entity.User;

public interface GroupRepository extends JpaRepository<Group, Long> {

}
