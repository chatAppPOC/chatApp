package com.example.chatbot.entity;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String content;

	private String recipient;

	@Enumerated(EnumType.STRING)
	private NotificationType notificationType;

	@Enumerated(EnumType.STRING)
	private NotificationStatus notificationStatus;

	private Long playerId;

	private Instant sentAt;

	private Instant scheduledTime;

	private Instant expireTime;

	public Notification() {

	}

	public Notification(String content, String recipient, NotificationType notificationType,
			NotificationStatus notificationStatus, Long playerId, Instant sentAt, Instant scheduledTime,
			Instant expireTime) {
		this.content = content;
		this.recipient = recipient;
		this.notificationType = notificationType;
		this.notificationStatus = notificationStatus;
		this.playerId = playerId;
		this.sentAt = sentAt;
		this.scheduledTime = scheduledTime;
		this.expireTime = expireTime;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getRecipient() {
		return recipient;
	}

	public void setRecipient(String recipient) {
		this.recipient = recipient;
	}

	public NotificationType getNotificationType() {
		return notificationType;
	}

	public void setNotificationType(NotificationType notificationType) {
		this.notificationType = notificationType;
	}

	public NotificationStatus getNotificationStatus() {
		return notificationStatus;
	}

	public void setNotificationStatus(NotificationStatus notificationStatus) {
		this.notificationStatus = notificationStatus;
	}

	public Long getPlayerId() {
		return playerId;
	}

	public void setPlayerId(Long playerId) {
		this.playerId = playerId;
	}

	public Instant getSentAt() {
		return sentAt;
	}

	public void setSentAt(Instant sentAt) {
		this.sentAt = sentAt;
	}

	public Instant getScheduledTime() {
		return scheduledTime;
	}

	public void setScheduledTime(Instant scheduledTime) {
		this.scheduledTime = scheduledTime;
	}

	public Instant getExpireTime() {
		return expireTime;
	}

	public void setExpireTime(Instant expireTime) {
		this.expireTime = expireTime;
	}

	public enum NotificationType {
		EMAIL, SMS, PUSH_NOTIFICATION
	}

	public enum NotificationStatus {
		PENDING, SENT, FAILED
	}

	@Override
	public String toString() {
		return "Notification [id=" + id + ", content=" + content + ", notificationType=" + notificationType
				+ ", notificationStatus=" + notificationStatus + ", playerId=" + playerId + ", sentAt=" + sentAt
				+ ", scheduledTime=" + scheduledTime + ", expireTime=" + expireTime + "]";
	}

}
