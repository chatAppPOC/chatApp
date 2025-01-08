package com.activision.chatbot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.activision.chatbot.entity.Language;
import com.activision.chatbot.repo.LanguageRepository;

@Service
public class LanguageService {
	private static final org.slf4j.Logger LOG = org.slf4j.LoggerFactory.getLogger(LanguageService.class);
	
	@Autowired
	LanguageRepository languageRepository;
	
	
	public List<Language> getLanguages(){
		try {
			List<Language> languages = languageRepository.findAll();
			LOG.debug("LanguageService.getLanguages() => {}", languages);
			return languages;
		}
		catch(Exception e) {
			LOG.error("LanguageService.getLanguages() => error!", e);
			throw e;
		}
	}
	
}
