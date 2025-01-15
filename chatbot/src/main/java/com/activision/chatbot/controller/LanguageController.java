package com.activision.chatbot.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.activision.chatbot.entity.Language;
import com.activision.chatbot.service.LanguageService;

@RestController
@RequestMapping("/api")
public class LanguageController {
	private static final Logger LOG = LoggerFactory.getLogger(LanguageController.class);
	
	@Autowired
	LanguageService languageService;
	
	@GetMapping("/languages")
	@PreAuthorize("hasAuthority('ADMIN')")
	public List<Language> getLanguages() {
		try {
			List<Language> response = languageService.getLanguages();
			LOG.info("Api.getLanguages() => {}", response);
			return response;
		} catch (Exception e) {
			LOG.error("Api.getLanguages() => error!!!", e);
			throw e;
		}
	}
	
}

