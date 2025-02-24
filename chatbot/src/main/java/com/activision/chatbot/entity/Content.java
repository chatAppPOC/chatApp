package com.activision.chatbot.entity;

import java.time.Instant;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "content", uniqueConstraints={@UniqueConstraint(columnNames = {"language_id" , "name"})})
@JsonInclude(Include.NON_NULL)
public class Content {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@JdbcTypeCode(SqlTypes.JSON)
	@Column(columnDefinition = "jsonb")
	private com.activision.chatbot.model.Content content;
	private String name;
	private Long languageId;
	private Long titleId;
	private Instant createdOn;
	private Instant updatedOn;
	private String updatedBy;
	private String createdBy;
	
	public Content() {
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public com.activision.chatbot.model.Content getContent() {
		return content;
	}
	public void setContent(com.activision.chatbot.model.Content content) {
		this.content = content;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Long getLanguageId() {
		return languageId;
	}
	public void setLanguageId(Long languageId) {
		this.languageId = languageId;
	}
	public Instant getCreatedOn() {
		return createdOn;
	}
	public void setCreatedOn(Instant createdOn) {
		this.createdOn = createdOn;
	}
	public Instant getUpdatedOn() {
		return updatedOn;
	}
	public void setUpdatedOn(Instant updatedOn) {
		this.updatedOn = updatedOn;
	}
	public String getUpdatedBy() {
		return updatedBy;
	}
	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public Long getTitleId() {
		return titleId;
	}
	public void setTitleId(Long titleId) {
		this.titleId = titleId;
	}

	@Override
	public String toString() {
		return "Content [id=" + id + ", content=" + content + ", name=" + name + ", languageId=" + languageId
				+ ", titleId=" + titleId + ", createdOn=" + createdOn + ", updatedOn=" + updatedOn + ", updatedBy="
				+ updatedBy + ", createdBy=" + createdBy + "]";
	}

}
