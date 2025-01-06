package com.example.chatbot.dto;

import java.time.Instant;

public interface ContentLanguageProjection {
	interface ContentProjection {
		Long getId();

		String getName();

		Instant getCreatedOn();

		Instant getUpdatedOn();

		String getUpdatedBy();

		String getCreatedBy();
	}

	interface LanguageProjection {
		String getName();
	}
}
