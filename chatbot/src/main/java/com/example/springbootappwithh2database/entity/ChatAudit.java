package com.example.springbootappwithh2database.entity;

import java.time.Instant;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "chat")
public class ChatAudit {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String userId;
	private Set<Integer> questions;
	private Set<Integer> answers;
	private String description;
	private Instant createdOn;
	private Instant updatedOn;
	
	public ChatAudit(String userId, Set<Integer> questions, Set<Integer> answers, String description, Instant createdOn, Instant updatedOn) {
	    this.userId = userId;
	    this.questions = questions;
	    this.answers = answers;
	    this.description = description;
	    this.createdOn = createdOn;
	    this.updatedOn = updatedOn;
	}
	
	public ChatAudit() {
		
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Set<Integer> getQuestions() {
		return questions;
	}

	public void setQuestions(Set<Integer> questions) {
		this.questions = questions;
	}

	public Set<Integer> getAnswers() {
		return answers;
	}

	public void setAnswers(Set<Integer> answers) {
		this.answers = answers;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	@Override
	public String toString() {
		return "ChatAudit [id=" + id + ", userId=" + userId + ", questions=" + questions + ", answers=" + answers
				+ ", description=" + description + ", createdOn=" + createdOn + ", updatedOn=" + updatedOn + "]";
	}
	
	
}