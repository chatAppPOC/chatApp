package com.activision.chatbot.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.activision.chatbot.dto.ContentResponse;
import com.activision.chatbot.entity.Content;

public interface ContentRepository extends JpaRepository<Content, Long>{
   
	@Query(value = "select * from content where language_id = ?1", nativeQuery = true) 
	List<Content> findAllByLanguageId(Long languageId);

	@Query(value = "select c.id as id, c.name as name, l.name as language, c.updated_on as updatedOn, c.created_on as createdOn, c.updated_by as updatedBy, c.created_by as createdBy, c.title_id as titleId"
			+ " from content c inner join language l on c.language_id = l.id order by c.id", nativeQuery = true) 
	List<ContentResponse> findAllContents();
	
	@Query(value = "select exists(select * from content where language_id = ?1 and name = ?2)", nativeQuery = true) 
	Boolean existsByLanguageIdAndName(Long id, String name);
	
	@Query(value = "select exists(select * from content where language_id = ?1 and title_id = ?2)", nativeQuery = true) 
	Boolean existsByLanguageIdAndTitle(Long languageId, Long titleId);
}
