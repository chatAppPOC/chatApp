package com.example.chatbot.dto;

public class ChatOutput {
	private Integer id;
	private String content;
	private String contentType;
	private Long chatId;
	
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public Long getChatId() {
		return chatId;
	}

	public void setChatId(Long chatId) {
		this.chatId = chatId;
	}

	@Override
	public String toString() {
		return "ChatOutput [id=" + id + ", content=" + content + ", contentType=" + contentType + ", chatId=" + chatId
				+ "]";
	}

}
