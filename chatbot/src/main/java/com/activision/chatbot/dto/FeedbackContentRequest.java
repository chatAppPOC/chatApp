package com.activision.chatbot.dto;

import java.util.List;
import java.util.Map;

import com.activision.chatbot.entity.Feedback.FeedbackCategory;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.NotNull;

public class FeedbackContentRequest {
	@NotNull
	private FeedbackCategory feedbackCategory;
	@NotNull
	private Long titleId;
	@NotNull
	private Long languageId;

	@NotNull
	private List<QAContent> qaContent;
	
	public FeedbackCategory getFeedbackCategory() {
		return feedbackCategory;
	}
	public void setFeedbackCategory(FeedbackCategory feedbackCategory) {
		this.feedbackCategory = feedbackCategory;
	}
	public Long getTitleId() {
		return titleId;
	}
	public void setTitleId(Long titleId) {
		this.titleId = titleId;
	}
	public Long getLanguageId() {
		return languageId;
	}
	public void setLanguageId(Long languageId) {
		this.languageId = languageId;
	}
	public List<QAContent> getQaContent() {
		return qaContent;
	}
	public void setQaContent(List<QAContent> qaContent) {
		this.qaContent = qaContent;
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class QAContent {
		private String question;
		private Map<String, Integer> responses;
		public String getQuestion() {
			return question;
		}
		public void setQuestion(String question) {
			this.question = question;
		}
		public Map<String, Integer> getResponses() {
			return responses;
		}
		public void setResponses(Map<String, Integer> responses) {
			this.responses = responses;
		}
		@Override
		public String toString() {
			return "FeedbackContent [question=" + question + ", responses=" + responses + "]";
		}

	}
}
