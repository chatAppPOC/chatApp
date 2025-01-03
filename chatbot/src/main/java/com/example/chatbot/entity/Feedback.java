package com.example.chatbot.entity;

import java.time.Instant;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.example.chatbot.dto.FeedbackRequest.QeustionAndAnswerReq;

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
	private List<QeustionAndAnswerReq> request;
	private Boolean issueResolved;
	private Boolean satisfiedWithSupport;
	private Long score;
	private Instant createdAt;
	
	public Feedback() {

	}

	public Feedback(Long chatId, Long caseId, FeedbackCategory feedbackCategory, List<QeustionAndAnswerReq> request,
			Boolean issueResolved, Boolean satisfiedWithSupport, Long score) {
		this.chatId = chatId;
		this.caseId = caseId;
		this.feedbackCategory = feedbackCategory;
		this.request = request;
		this.issueResolved = issueResolved;
		this.satisfiedWithSupport = satisfiedWithSupport;
		this.score = score;
		this.createdAt = Instant.now();
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

	public List<QeustionAndAnswerReq> getRequest() {
		return request;
	}

	public void setRequest(List<QeustionAndAnswerReq> request) {
		this.request = request;
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

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	@Override
	public String toString() {
		return "Feedback [id=" + id + ", chatId=" + chatId + ", caseId=" + caseId + ", feedbackCategory="
				+ feedbackCategory + ", request=" + request + ", issueResolved=" + issueResolved
				+ ", satisfiedWithSupport=" + satisfiedWithSupport + ", score=" + score + ", createdAt=" + createdAt
				+ "]";
	}
}
