package com.example.chatbot.dto;
import java.util.ArrayList;
import java.util.List;

import com.example.chatbot.entity.ChatContent;

public class ChatResponse {
	private Long chatId;
	private List<ChatContent> options = new ArrayList<>();
	

	public Long getChatId() {
		return chatId;
	}
	public void setChatId(Long chatId) {
		this.chatId = chatId;
	}
	public List<ChatContent> getOptions() {
		return options;
	}
	public void setOptions(List<ChatContent> options) {
		this.options = options;
	}
	
}
