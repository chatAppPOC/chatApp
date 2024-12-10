package com.example.chatbot.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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
	private Long id;
	private Long playerId;
	private List<Long> questions;
	private List<Long> answers;
	private String description;
	private String status;
	private Instant createdOn;
	private Instant updatedOn;
	
	public Chat(Long playerId, String status) {
	    this.playerId = playerId;
	    this.questions = new ArrayList<>();
	    this.answers = new ArrayList<>();
	    this.status = status;
	    this.createdOn = Instant.now();
	}
	
	public Chat() {
		
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public Long getPlayerId() {
		return playerId;
	}

	public void setPlayerId(Long playerId) {
		this.playerId = playerId;
	}

	public List<Long> getQuestions() {
		return questions;
	}

	public void setQuestions(List<Long> questions) {
		this.questions = questions;
	}

	public List<Long> getAnswers() {
		return answers;
	}

	public void setAnswers(List<Long> answers) {
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
		return "Chat [id=" + id + ", playerId=" + playerId + ", questions=" + questions + ", answers=" + answers
				+ ", description=" + description + ", status=" + status + ", createdOn=" + createdOn + ", updatedOn="
				+ updatedOn + "]";
	}	
}
