package com.activision.chatbot.entity;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "case_audit")
//@JsonInclude(Include.NON_NULL)
public class Case {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Long chatId;
	private Long userId;
	private String feedback;
	private Instant createdOn;
	@Enumerated(EnumType.STRING)
	private CaseStatus status;
	private String caseType;
	private LocalDate completedOn;
	private String gameName;
	private LocalDate startedOn;

	public enum CaseStatus {
		OPEN, RESOLVED, IN_PROGRESS
	}

	public Case() {
	}

	public Case(Long userId, Long chatId, String caseType, String gameName) {
		this.userId = userId;
		this.chatId = chatId;
		this.caseType = caseType;
		this.gameName = gameName;
		this.createdOn = Instant.now();
		this.status = CaseStatus.OPEN;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getChatId() {
		return chatId;
	}

	public void setChatId(Long chatId) {
		this.chatId = chatId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getFeedback() {
		return feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
	}

	public Instant getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Instant createdOn) {
		this.createdOn = createdOn;
	}

	public CaseStatus getStatus() {
		return status;
	}

	public void setStatus(CaseStatus status) {
		this.status = status;
	}

	public String getCaseType() {
		return caseType;
	}

	public void setCaseType(String caseType) {
		this.caseType = caseType;
	}

	public String getGameName() {
		return gameName;
	}

	public void setGameName(String gameName) {
		this.gameName = gameName;
	}

	public LocalDate getCompletedOn() {
		return completedOn;
	}

	public void setCompletedOn(LocalDate completedOn) {
		this.completedOn = completedOn;
	}

	public LocalDate getStartedOn() {
		return startedOn;
	}

	public void setStartedOn(LocalDate startedOn) {
		this.startedOn = startedOn;
	}

	@Override
	public String toString() {
		return "Case [id=" + id + ", chatId=" + chatId + ", userId=" + userId + ", feedback=" + feedback
				+ ", createdOn=" + createdOn + ", status=" + status + ", caseType=" + caseType + ", completedOn="
				+ completedOn + ", gameName=" + gameName + ", startedOn=" + startedOn + "]";
	}
}
