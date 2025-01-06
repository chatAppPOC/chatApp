package com.example.chatbot.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	public ChatContent updateContent(@RequestParam(name ="contentId") Long contentId, @RequestBody ChatContent chatContent) {
		try {
			ChatContent updatedContent = chatContentService.updateContent(contentId, chatContent);
	    	LOG.info("Api.updateContent({}) => {}", chatContent, updatedContent);
			return updatedContent;
		} catch (Exception e) {
    		LOG.error("Api.updateContent({}) => error!!!", chatContent, e);
			throw e;
		}
	}
	
	@DeleteMapping("/content")
	public ChatContent deleteContent(@RequestParam(name ="contentId") Long contentId) {
		try {
			ChatContent deletedContent = chatContentService.deleteContent(contentId);
	    	LOG.info("Api.deleteContent({}) => {}", contentId, deletedContent);
			return deletedContent;
		} catch (Exception e) {
    		LOG.error("Api.deleteContent({}) => error!!!", contentId, e);
			throw e;
		}
	}
	
	@PostMapping("/content")
	public ChatContent createContent(@RequestParam(name ="contentId") Long contentId, @RequestBody ChatContent chatContent) {
		try {
			ChatContent createdContent = chatContentService.createContent(contentId,chatContent);
	    	LOG.info("Api.createContent({}) => {}", chatContent, createdContent);
			return createdContent;
		} catch (Exception e) {
    		LOG.error("Api.createContent({}) => error!!!", chatContent, e);
			throw e;
		}
	}
	
	@PostMapping("/content/copy")
	public boolean copyContent(@RequestParam(name ="modelId") Long modelId) {
		try {
			boolean createdContent = chatContentService.copyContent(modelId);
	    	LOG.info("Api.copyContent({}) => {}", modelId);
			return createdContent;
		} catch (Exception e) {
    		LOG.error("Api.copyContent() => error!!!", e);
			throw e;
		}
	}
	

}
