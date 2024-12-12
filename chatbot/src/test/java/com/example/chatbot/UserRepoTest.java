package com.example.chatbot;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.chatbot.repo.UserRepository;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepoTest {

	@Autowired
	UserRepository userRepository;

	@Test
	public void fetchUser() {
		var lang = 1L;
		var platform = 1L;
		var title = 1L;

		var user = userRepository.fetchUserByLanguageAndPlatformAndTitle(lang, platform, title);
		assertNotNull(user);
	}

}
