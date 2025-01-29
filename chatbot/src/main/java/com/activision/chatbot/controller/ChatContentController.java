package com.activision.chatbot.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.activision.chatbot.dto.ContentResponse;
import com.activision.chatbot.entity.Content;
import com.activision.chatbot.service.ChatContentService;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api")
public class ChatContentController {
	
	private static final Logger LOG = LoggerFactory.getLogger(ChatContentController.class);

	@Autowired
	private ChatContentService chatContentService;
	
	@PutMapping("v2/content")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?>  updateContentv2(@RequestParam Long titleId, @RequestParam Long contentId, @RequestParam String name, @RequestBody com.activision.chatbot.model.Content chatContent) {
		try {
			Content updatedContent = chatContentService.updateContentv2(contentId, chatContent, name, titleId);
	    	LOG.info("Api.updateContentv2({}, {}) => {}", contentId, chatContent, updatedContent);
			return ResponseEntity.status(HttpStatus.OK).body(updatedContent);
		} catch (Exception e) {
    		LOG.error("Api.updateContentv2({}, {}) => error!!!", contentId, chatContent);
			throw e;
		}
	}
	
	@DeleteMapping("v2/content")
	@PreAuthorize("hasAuthority('ADMIN')")
	public Content deleteContentv2(@RequestParam Long contentId) {
		try {
			Content deletedContent = chatContentService.deleteContentv2(contentId);
	    	LOG.info("Api.deleteContentv2({}) => {}", contentId, deletedContent);
			return deletedContent;
		} catch (Exception e) {
    		LOG.error("Api.deleteContentv2({}) => error!!!", contentId);
			throw e;
		}
	}
	
	@PostMapping("v2/content")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?> createContentv2(@NotNull @RequestParam Long titleId,
			@NotNull @RequestParam Long languageId, @NotBlank @RequestParam String name,
			@RequestBody com.activision.chatbot.model.Content chatContent) throws Exception {
		try {
			Content createdContent = chatContentService.createContentv2(chatContent, languageId, name, titleId);
			LOG.info("Api.createContentv2({}, {}) => {}", languageId, chatContent, createdContent);
			return ResponseEntity.status(HttpStatus.CREATED).body(createdContent);
		} catch (Exception e) {
			LOG.error("Api.createContentv2({}, {}) => error!!!", languageId, chatContent);
			throw e;
		}
	}
	
	@PostMapping("v2/content/copy")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?>  copyContentv2(@NotNull @RequestParam Long titleId, @RequestParam Long srcContentId, @NotBlank @RequestParam String name) throws Exception {
		try {
			Content createdContent = chatContentService.copyContentv2(srcContentId, name, titleId);
	    	LOG.info("Api.copyContentv2({}) => {}", srcContentId, createdContent);
			return ResponseEntity.status(HttpStatus.CREATED).body(createdContent);
		} catch (Exception e) {
    		LOG.error("Api.copyContentv2({}) => error!!!", srcContentId);
			throw e;
		}
	}
	
	@GetMapping("v2/content")
	@PreAuthorize("hasAnyAuthority('ADMIN','USER','PLAYER')")
	public Content getContentv2(@RequestParam Long contentId) {
		try {
			Content content = chatContentService.getContentv2(contentId);
	    	LOG.info("Api.getContentv2({}) => {}", contentId, content);
			return content;
		} catch (Exception e) {
    		LOG.error("Api.getContentv2({}) => error!!!", contentId);
			throw e;
		}
	}
	
	@GetMapping("v2/contents")
	@PreAuthorize("hasAnyAuthority('ADMIN','USER','PLAYER')")
	public List<ContentResponse> getContents() {
		try {
			List<ContentResponse> contents = chatContentService.getContents();
	    	LOG.info("Api.getContents() => {}",contents);
			return contents;
		} catch (Exception e) {
    		LOG.error("Api.getContents() => error!!!");
			throw e;
		}
	}
}
