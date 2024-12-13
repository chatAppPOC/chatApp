package com.example.chatbot.model;

import java.time.Instant;

public class Message {
	private String content;
	private Long contentId;
	private String source;
	private Instant timestamp;

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getContentId() {
		return contentId;
	}

	public void setContentId(Long contentId) {
		this.contentId = contentId;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public Instant  getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Instant  timestamp) {
		this.timestamp = timestamp;
	}

}
