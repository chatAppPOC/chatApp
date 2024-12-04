package com.example.chatbot.entity;

import java.time.Instant;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "chat")
public class Chat {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String userId;
	private List<Integer> questions;
	private List<Integer> answers;
	private String description;
	private String status;
	private Instant createdOn;
	private Instant updatedOn;
	
	public Chat(String userId, List<Integer> questions, List<Integer> answers, String description, String status, Instant createdOn, Instant updatedOn) {
	    this.userId = userId;
	    this.questions = questions;
	    this.answers = answers;
	    this.description = description;
	    this.status = status;
	    this.createdOn = createdOn;
	    this.updatedOn = updatedOn;
	}
	
	public Chat() {
		
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


	public List<Integer> getQuestions() {
		return questions;
	}

	public void setQuestions(List<Integer> questions) {
		this.questions = questions;
	}

	public List<Integer> getAnswers() {
		return answers;
	}

	public void setAnswers(List<Integer> answers) {
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "ChatAudit [id=" + id + ", userId=" + userId + ", questions=" + questions + ", answers=" + answers
				+ ", description=" + description + ", status=" + status + ", createdOn=" + createdOn + ", updatedOn="
				+ updatedOn + "]";
	}
}
