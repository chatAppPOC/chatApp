package com.activision.chatbot.dto;


import java.time.LocalDateTime;
import java.util.List;

import com.activision.chatbot.entity.Notification.NotificationSource;
import com.activision.chatbot.entity.Notification.NotificationStatus;

public class NotificationRequest {

    private String content;
    private List<NotificationSource> sources; // Pass source as a list of strings (e.g., "EMAIL", "PUSH_NOTIFICATION")
    private String recipient;
    private Long playerId;
    private LocalDateTime scheduleTime;
    private LocalDateTime expireTime;
    private Integer sentCount; 
    private Integer count; 
    private NotificationStatus notificationStatus; 

    
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<NotificationSource> getSource() {
        return sources;
    }

    public void setSource(List<NotificationSource> sources) {
        this.sources = sources;
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

    public NotificationStatus getNotificationStatus() {
        return notificationStatus;
    }

    public void setNotificationStatus(NotificationStatus notificationStatus) {
        this.notificationStatus = notificationStatus;
    }
}
