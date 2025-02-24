package com.activision.chatbot.entity;

import jakarta.persistence.*;
import java.time.Instant;
@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @Enumerated(EnumType.STRING)
    private NotificationSource source;

    private Long playerId; // Reference to the Player table

    private Instant scheduledTime; // Scheduled time for the notification

    @Enumerated(EnumType.STRING)
	private NotificationStatus notificationStatus;

    private Instant expireTime; // Expiration time for the notification

    @Column(name = "SentCount")
    private int sentCount; // Dynamic count that increments

    @Column(name = "Count")
    private int count; // Static count for the upper limit (flag)

    // Getters and Setters
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
    public NotificationStatus getNotificationStatus() {
		return notificationStatus;
	}
 
	public void setNotificationStatus(NotificationStatus notificationStatus) {
		this.notificationStatus = notificationStatus;
	}

    public NotificationSource getSource() {
        return source;
    }

    public void setSource(NotificationSource source) {
        this.source = source;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
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

    public int getSentCount() {
        return sentCount;
    }

    public void setSentCount(int sentCount) {
        this.sentCount = sentCount;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public enum NotificationSource {
        EMAIL, PUSH_NOTIFICATION 
    }

    public enum NotificationStatus {
		PENDING, SENT, FAILED
	}

}