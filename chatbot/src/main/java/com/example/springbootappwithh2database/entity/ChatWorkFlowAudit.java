package com.example.springbootappwithh2database.entity;

import java.time.Instant;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_workflow_audit")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatWorkFlowAudit {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String questionId;
	private String chatByName;
	private List<String> question;
	private List<String> answer;
	private String description;
	private Instant actionOn;
}