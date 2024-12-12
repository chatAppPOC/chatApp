package com.example.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.chatbot.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	@Query(value = """
			SELECT u.id, u.first_name, u.last_name, u.preferred_language, u.platform, u.title FROM users u
			 WHERE ARRAY_CONTAINS(u.preferred_language, ?) AND ARRAY_CONTAINS(u.platform, ?) AND ARRAY_CONTAINS(u.title, ?) LIMIT 1
			""", nativeQuery = true)
	User fetchUserByLanguageAndPlatformAndTitle(@Param("language") Long language, @Param("platform") Long platform,
			@Param("title") Long title);
}
