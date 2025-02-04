package com.activision.chatbot.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.activision.chatbot.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	@Query(value = """
			SELECT u.id, u.first_name, u.last_name, u.preferred_language, u.platform, u.title FROM users u
			WHERE ?1 = ANY(u.preferred_language) AND ?2 = ANY(u.platform) AND ?3 = ANY(u.title) LIMIT 1
			""", nativeQuery = true)
	User fetchUserByLanguageAndPlatformAndTitle(@Param("language") Long language, @Param("platform") Long platform,
			@Param("title") Long title);
	
	@Query("SELECT u FROM User u WHERE u.email = :email")
    public User getUserByEmail(@Param("email") String email);
	
	@Query(value = """
		    select u.* from users u inner join users_roles ur ON u.id = ur.user_id
			inner join roles r ON ur.role_id = r.id
			where r.name in ('USER') and u.enabled = true
			""", nativeQuery = true)
	List<User> fetchUsers();
}
