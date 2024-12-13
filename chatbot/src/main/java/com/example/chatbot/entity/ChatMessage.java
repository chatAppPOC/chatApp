package com.example.chatbot.entity;

import java.time.Instant;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long chatId;
	@JdbcTypeCode(SqlTypes.JSON)
	private List<Message> messages;

	public Long getChatId() {
		return chatId;
	}

	public void setChatId(Long chatId) {
		this.chatId = chatId;
	}

	public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

	@Override
	public String toString() {
		return "ChatMessage [chatId=" + chatId + ", messages=" + messages + "]";
	}

	public static class Message {
		private String content;
		private Long contentId;
		private String contentType;
		private Source source;
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

		public String getContentType() {
			return contentType;
		}

		public void setContentType(String contentType) {
			this.contentType = contentType;
		}

		public Source getSource() {
			return source;
		}

		public void setSource(Source source) {
			this.source = source;
		}

		public Instant getTimestamp() {
			return timestamp;
		}

		public void setTimestamp(Instant timestamp) {
			this.timestamp = timestamp;
		}
		

		@Override
		public String toString() {
			return "Message [contentId=" + contentId + ", contentType=" + contentType + ", source=" + source
					+ ", timestamp=" + timestamp + "]";
		}

		public enum Source {
			BOT, 
			USER, 
			PLAYER
		}
	}

	
}
