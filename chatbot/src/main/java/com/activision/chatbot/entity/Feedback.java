package com.activision.chatbot.entity;

import java.time.Instant;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.activision.chatbot.dto.FeedbackRequest.QuestionAndAnswerReq;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
	@Enumerated(EnumType.STRING)
	private FeedbackCategory feedbackCategory;
	@JdbcTypeCode(SqlTypes.JSON)
	private List<QuestionAndAnswerReq> description;
	private Boolean issueResolved;
	private int averageScore;
	private Instant createdOn;
	
	public Feedback() {

	}

	public Feedback(Long chatId, Long caseId, FeedbackCategory feedbackCategory, List<QuestionAndAnswerReq> description,
			Boolean issueResolved, int averageScore) {
		this.chatId = chatId;
		this.caseId = caseId;
		this.feedbackCategory = feedbackCategory;
		this.description = description;
		this.issueResolved = issueResolved;
		this.averageScore = averageScore;
		this.createdOn = Instant.now();
	}

	public enum FeedbackCategory {
		CHAT, CASE
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

	public FeedbackCategory getFeedbackCategory() {
		return feedbackCategory;
	}

	public void setFeedbackCategory(FeedbackCategory feedbackCategory) {
		this.feedbackCategory = feedbackCategory;
	}

	public List<QuestionAndAnswerReq> getDescription() {
		return description;
	}

	public void setDescription(List<QuestionAndAnswerReq> description) {
		this.description = description;
	}

	public Boolean getIssueResolved() {
		return issueResolved;
	}

	public void setIssueResolved(Boolean issueResolved) {
		this.issueResolved = issueResolved;
	}

	public int getAverageScore() {
		return averageScore;
	}

	public void setAverageScore(int averageScore) {
		this.averageScore = averageScore;
	}

	public Instant getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Instant createdOn) {
		this.createdOn = createdOn;
	}

	@Override
	public String toString() {
		return "Feedback [id=" + id + ", chatId=" + chatId + ", caseId=" + caseId + ", feedbackCategory="
				+ feedbackCategory + ", description=" + description + ", issueResolved=" + issueResolved
				+ ", averageScore=" + averageScore + ", createdOn=" + createdOn + "]";
	}
}
