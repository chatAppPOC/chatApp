package com.example.springbootappwithh2database.entity;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name ="chat_workflow")
public class ChatWorkFlow
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Integer id ;
    private String content;
	private String contentType;
	private Integer chatType;
	private Integer parentId;
	private Instant createdDate;
	private Instant modifiedDate;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getContentType() {
		return contentType;
	}
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	public Integer getChatType() {
		return chatType;
	}
	public void setChatType(Integer chatType) {
		this.chatType = chatType;
	}
	public Integer getParentId() {
		return parentId;
	}
	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}
	public Instant getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Instant createdDate) {
		this.createdDate = createdDate;
	}
	public Instant getModifiedDate() {
		return modifiedDate;
	}
	public void setModifiedDate(Instant modifiedDate) {
		this.modifiedDate = modifiedDate;
	}
	@Override
	public String toString() {
		return "ChatWorkFlow [id=" + id + ", content=" + content + ", contentType=" + contentType + ", chatType="
				+ chatType + ", parentId=" + parentId + ", createdDate=" + createdDate + ", modifiedDate="
				+ modifiedDate + "]";
	}
	
	
}
