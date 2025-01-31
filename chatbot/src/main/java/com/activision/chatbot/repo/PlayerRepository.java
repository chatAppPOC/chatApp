package com.activision.chatbot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.activision.chatbot.dto.PlayerUserResponse;
import com.activision.chatbot.entity.Player;

public interface PlayerRepository extends JpaRepository<Player, Long>{
   
	@Query(value = """
			SELECT u.id AS userId,
			   	u.first_name AS userFirstName,
			   	u.last_name AS userLastName,
			   	u.preferred_language AS userLanguage,
			   	u.platform AS userPlatform,
			   	t.id AS title
			FROM player p
			JOIN title t ON p.title = t.id
			JOIN users u ON p.preferred_language = ANY(u.preferred_language)
			AND p.platform = ANY(u.platform)
			AND p.title = ANY(u.title)
            JOIN users_roles ur ON ur.user_Id=u.id
			JOIN roles r ON ur.role_Id= r.id
			WHERE p.id = 3 And r.id=(select id from roles where name='USER') limit 1
	        """, nativeQuery = true)
	        PlayerUserResponse fetchUserByLanguageAndPlatformAndTitle(@Param("playerId") Long playerId);
	
	@Query("SELECT p FROM Player p WHERE p.email = :email")
    public Player getPlayerByEmail(@Param("email") String email);
	
	@Query("SELECT t.name FROM Title t WHERE t.id = :title")
    public String getPlayerTitleName(@Param("title") Long title);
}
