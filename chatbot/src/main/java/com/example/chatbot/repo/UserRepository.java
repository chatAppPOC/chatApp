package com.example.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.chatbot.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	@Query("""
			    SELECT u from User u WHERE 	u.preferredLanguage = :language AND u.platform = :platform AND u.title = :title ORDER BY preferredLanguage ASC LIMIT 1
			""")
	User fetchUser(@Param("language") Long language,
			@Param("platform") Long platform, @Param("title") Long title);

}
