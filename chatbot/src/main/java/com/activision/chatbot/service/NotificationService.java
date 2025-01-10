package com.activision.chatbot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import com.activision.chatbot.dto.NotificationRequest;
import com.activision.chatbot.entity.Notification;
import com.activision.chatbot.entity.Notification.NotificationSource;
import com.activision.chatbot.repo.NotificationRepository;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NotificationService {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification addNotification(Notification notification) {
        try {
            return notificationRepository.save(notification);
        } catch (Exception e) {
            LOG.error("Error while adding notification: ", e);
            throw new RuntimeException("Failed to add notification", e);
        }
    }  @Transactional
    @Scheduled(fixedRate = 10000)
    public void sendScheduledNotifications() {
        List<Notification> notifications = notificationRepository.findAll();
    
        for (Notification notification : notifications) {
            try {
                if (notification.getScheduleTime() != null) {
                    Instant scheduleInstant = notification.getScheduleTime().atZone(ZoneOffset.UTC).toInstant();
    
                    if (scheduleInstant.isAfter(Instant.now())) {
                        notification.setNotificationStatus(Notification.NotificationStatus.PENDING);
                        notificationRepository.save(notification);
                        LOG.info("Notification ID {} is pending. Scheduled time: {}", notification.getId(), scheduleInstant);
                    } else if (notification.getSentCount() < notification.getCount() &&
                               Objects.equals(notification.getSource(), NotificationSource.PUSH_NOTIFICATION)) {
                        // Sending notification logic
                        Map<String, String> payload = new HashMap<>();
                        payload.put("content", notification.getContent());
                        payload.put("sentCount", String.valueOf(notification.getSentCount()));
                        payload.put("id", String.valueOf(notification.getId()));
                        payload.put("playerId", String.valueOf(notification.getPlayerId()));
    
                        messagingTemplate.convertAndSend("/topic/notifications", payload);
    
                        notification.setSentCount(notification.getSentCount() + 1);
                        notification.setNotificationStatus(Notification.NotificationStatus.SENT);
                        notificationRepository.save(notification);
    
                        LOG.info("Notification ID {} sent successfully. Payload: {}", notification.getId(), payload);
                        LOG.info("Notification ID {}: Sent {} out of {} notifications.", 
                                  notification.getId(), 
                                  notification.getSentCount(), 
                                  notification.getCount());
                        Thread.sleep(3000);
                    } else if (notification.getSentCount() >= notification.getCount()) {
                        notification.setNotificationStatus(Notification.NotificationStatus.SENT);
                        LOG.info("All notifications for ID {} have been sent.", notification.getId());
                    }
                }
            } catch (Exception e) {
                notification.setNotificationStatus(Notification.NotificationStatus.FAILED);
                notificationRepository.save(notification);
                LOG.error("Failed to send notification with ID {}: ", notification.getId(), e);
            }
        }
    }

    public List<Notification> getNotificationsBySources(List<NotificationSource> sources) {
        try {
            List<Notification> notifications = notificationRepository.findAllBySourceIn(sources); 
            List<Notification> resultNotifications = new ArrayList<>();
        
            notifications.forEach(notification -> {
                if (notification.getSentCount() < notification.getCount()) {
                    Instant scheduleInstant = notification.getScheduleTime().atZone(ZoneOffset.UTC).toInstant();
                    if (scheduleInstant.isBefore(Instant.now()) && notification.getSource()!=null) {
                        try {
                            Map<String, String> payload = new HashMap<>();
                            payload.put("content", notification.getContent());
                            payload.put("id", String.valueOf(notification.getId()));
        
                            messagingTemplate.convertAndSend("/topic/notifications", payload);
                            notification.setSentCount(notification.getSentCount() + 1);
                            notificationRepository.save(notification);
                            resultNotifications.add(notification);
                        } catch (Exception e) {
                            LOG.error("Failed to send notification with ID {}: ", notification.getId(), e);
                        }
                    }
                } else {
                    LOG.info("Notification with ID {} has reached its limit.", notification.getId());
                }
            });
        
            return resultNotifications;
        } catch (Exception e) {
            LOG.error("Error while fetching notifications by sources: ", e);
            throw new RuntimeException("Failed to fetch notifications", e);
        }
    }
    
    public List<Notification> getNotificationsBySourcesAndPlayerId(List<NotificationSource> sourceStrings, Long playerId) {
        try {
            List<Notification> notifications = notificationRepository.findByPlayerIdAndSourceIn(playerId, sourceStrings);
            List<Notification> resultNotifications = new ArrayList<>();
        
            notifications.forEach(notification -> {
                if (notification.getSentCount() < notification.getCount()) {
                    resultNotifications.add(notification);
                    notification.setSentCount(notification.getSentCount() + 1);
                    notificationRepository.save(notification);
                }
            });
        
            return resultNotifications;
        } catch (Exception e) {
            LOG.error("Error while fetching notifications by sources and playerId: ", e);
            throw new RuntimeException("Failed to fetch notifications by sources and playerId", e);
        }
    }
    
    public Notification updateNotification(Long id, NotificationRequest notificationRequest) {
        try {
            Notification existingNotification = notificationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));
    
            existingNotification.setContent(notificationRequest.getContent());
    
            // Handle multiple sources: pick the first source or define your logic
            if (notificationRequest.getSource() != null && !notificationRequest.getSource().isEmpty()) {
                NotificationSource firstSource = notificationRequest.getSource().get(0); // Pick the first source
                existingNotification.setSource(firstSource);
            }
    
            existingNotification.setPlayerId(notificationRequest.getPlayerId());
    
            Instant scheduleTimeInstant = notificationRequest.getScheduleTime().toInstant(ZoneOffset.UTC);
            Instant expireTimeInstant = notificationRequest.getExpireTime().toInstant(ZoneOffset.UTC);
            existingNotification.setScheduleTime(scheduleTimeInstant);
            existingNotification.setExpireTime(expireTimeInstant);
    
            int sentCount = notificationRequest.getSentCount() != null
                    ? notificationRequest.getSentCount()
                    : existingNotification.getSentCount();
            existingNotification.setSentCount(sentCount);
    
            return notificationRepository.save(existingNotification);
        } catch (Exception e) {
            LOG.error("Error while updating notification with ID {}: ", id, e);
            throw new RuntimeException("Failed to update notification", e);
        }
    }
    

    public void deleteNotification(Long id) {
        try {
            if (!notificationRepository.existsById(id)) {
                LOG.error("Notification not found with ID: {}", id);
                throw new RuntimeException("Notification not found with ID: " + id);
            }
            notificationRepository.deleteById(id);
        } catch (Exception e) {
            LOG.error("Error while deleting notification with ID {}: ", id, e);
            throw new RuntimeException("Failed to delete notification", e);
        }
    }
}
