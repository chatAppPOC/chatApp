package com.example.chatbot.entity;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "feedback")
public class Feedback {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Long chatId;
	private Long caseId;
	private String feedback;
	private Boolean issueResolved;
	private Boolean satisfiedWithSupport;
	private Long score;
	private Instant createdAt;

	public Feedback(Long chatId, Long caseId, String feedback, Boolean issueResolved,
			Boolean satisfiedWithSupport, Long score) {
		this.chatId = chatId;
		this.caseId = caseId;
		this.feedback = feedback;
		this.issueResolved = issueResolved;
		this.satisfiedWithSupport = satisfiedWithSupport;
		this.score = score;
		this.createdAt = Instant.now();
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

	public Long getCaseId() {
		return caseId;
	}

	public void setCaseId(Long caseId) {
		this.caseId = caseId;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public String getFeedback() {
		return feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
	}

	public Boolean getIssueResolved() {
		return issueResolved;
	}

	public void setIssueResolved(Boolean issueResolved) {
		this.issueResolved = issueResolved;
	}

	public Boolean getSatisfiedWithSupport() {
		return satisfiedWithSupport;
	}

	public void setSatisfiedWithSupport(Boolean satisfiedWithSupport) {
		this.satisfiedWithSupport = satisfiedWithSupport;
	}

	public Long getScore() {
		return score;
	}

	public void setScore(Long score) {
		this.score = score;
	}

	@Override
	public String toString() {
		return "Feedback [id=" + id + ", chatId=" + chatId + ", caseId=" + caseId + ", feedback=" + feedback
				+ ", issueResolved=" + issueResolved + ", satisfiedWithSupport=" + satisfiedWithSupport + ", score="
				+ score + ", createdAt=" + createdAt + "]";
	}
}
