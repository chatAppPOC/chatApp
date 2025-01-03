package com.example.chatbot.dto;

import java.time.Instant;

public class ContentResponse {
	private Long id;
	private String name;
	private Instant createdOn;
	private Instant updatedOn;
	private String updatedBy;
	private String createdBy;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
	@Override
	public String toString() {
		return "ContentResponse [id=" + id + ", name=" + name + ", createdOn=" + createdOn + ", updatedOn=" + updatedOn
				+ ", updatedBy=" + updatedBy + ", createdBy=" + createdBy + "]";
	}
	
}
