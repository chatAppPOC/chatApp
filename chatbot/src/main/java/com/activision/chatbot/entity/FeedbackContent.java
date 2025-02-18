package com.activision.chatbot.entity;

import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.activision.chatbot.dto.FeedbackContentRequest.QAContent;
import com.activision.chatbot.entity.Feedback.FeedbackCategory;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name ="feedback_content")
public class FeedbackContent {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	@Enumerated(EnumType.STRING)
	private FeedbackCategory feedbackCategory;
	@JdbcTypeCode(SqlTypes.JSON)
	private List<QAContent> content;
    private Long preferredLanguage;
	private Long platform;
	private Long title;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public FeedbackCategory getFeedbackCategory() {
		return feedbackCategory;
	}
	public void setFeedbackCategory(FeedbackCategory feedbackCategory) {
		this.feedbackCategory = feedbackCategory;
	}
	public List<QAContent> getContent() {
		return content;
	}
	public void setContent(List<QAContent> list) {
		this.content = list;
	}
	public Long getPreferredLanguage() {
		return preferredLanguage;
	}
	public void setPreferredLanguage(Long preferredLanguage) {
		this.preferredLanguage = preferredLanguage;
	}
	public Long getPlatform() {
		return platform;
	}
	public void setPlatform(Long platform) {
		this.platform = platform;
	}
	public Long getTitle() {
		return title;
	}
	public void setTitle(Long title) {
		this.title = title;
	}
}
