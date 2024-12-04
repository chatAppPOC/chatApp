package com.example.chatbot.dto;

public class ChatInput {
	private String userId;
	private Integer questionId;
	private Integer answerId;
	private String description;
	private Boolean isChatBegin;
	
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public Integer getQuestionId() {
		return questionId;
	}
	public void setQuestionId(Integer questionId) {
		this.questionId = questionId;
	}
	public Integer getAnswerId() {
		return answerId;
	}
	public void setAnswerId(Integer answerId) {
		this.answerId = answerId;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Boolean getIsChatBegin() {
		return isChatBegin;
	}
	public void setIsChatBegin(Boolean isChatBegin) {
		this.isChatBegin = isChatBegin;
	}
	
	
}
