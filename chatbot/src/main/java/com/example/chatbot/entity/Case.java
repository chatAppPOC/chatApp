package com.example.chatbot.entity;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "case_audit")
public class Case {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Long chatId;
	private Long userId;
	private String feedback;
	private Instant createdAt;
	@Enumerated(EnumType.STRING)
	private CaseStatus status;

	public enum CaseStatus {
		OPEN, CLOSED
	}

	public Case(Long userId, Long chatId) {
		this.userId = userId;
		this.chatId = chatId;
		this.createdAt = Instant.now();
		this.status = CaseStatus.OPEN;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public CaseStatus getStatus() {
		return status;
	}

	public void setStatus(CaseStatus status) {
		this.status = status;
	}

	public String getFeedback() {
		return feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
	}

	public Long getChatId() {
		return chatId;
	}

	public void setChatId(Long chatId) {
		this.chatId = chatId;
	}

	@Override
	public String toString() {
		return "Case [id=" + id + ", chatId=" + chatId + ", userId=" + userId + ", feedback=" + feedback
				+ ", createdAt=" + createdAt + ", status=" + status + "]";
	}
}
