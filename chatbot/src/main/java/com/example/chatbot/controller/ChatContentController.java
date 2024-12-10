package com.example.chatbot.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.chatbot.entity.ChatContent;
import com.example.chatbot.service.ChatContentService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ChatContentController {
	
	private static final Logger LOG = LoggerFactory.getLogger(ChatContentController.class);

	@Autowired
	private ChatContentService chatContentService;

	@PutMapping("/content")
	public ChatContent updateContent(ChatContent content) {
		try {
			ChatContent updatedContent = chatContentService.updateContent(content);
	    	LOG.info("Api.updateContent({}) => {}", content, updatedContent);
			return updatedContent;
		} catch (Exception e) {
    		LOG.error("Api.updateContent({}) => error!!!", content, e);
			throw e;
		}
	}
}
