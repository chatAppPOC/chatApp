package com.example.chatbot.dto;
import java.time.LocalDateTime;

public class NotificationRequest {

    private String content;
    private String source; // Pass source as a string (e.g., "EMAIL", "PUSH_NOTIFICATION", etc.)
    private String recipient;
    private Long playerId; // Player ID reference
    private LocalDateTime scheduleTime;
    private LocalDateTime expireTime;
    private Integer sentCount; // Changed field name
    private Integer count; // Changed field name

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public LocalDateTime getScheduleTime() {
        return scheduleTime;
    }

    public void setScheduleTime(LocalDateTime scheduleTime) {
        this.scheduleTime = scheduleTime;
    }

    public LocalDateTime getExpireTime() {
        return expireTime;
    }

    public void setExpireTime(LocalDateTime expireTime) {
        this.expireTime = expireTime;
    }

    public Integer getSentCount() {
        return sentCount; // Changed method name
    }

    public void setSentCount(Integer sentCount) {
        this.sentCount = sentCount; // Changed method name
    }

    public Integer getCount() {
        return count; // Changed method name
    }

    public void setCount(Integer count) {
        this.count = count; // Changed method name
    }
}
