package com.activision.chatbot.service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.activision.chatbot.dto.NotificationRequest;
import com.activision.chatbot.entity.Notification;
import com.activision.chatbot.repo.NotificationRepository;
@Service
public class NotificationService {

   

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification addNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsBySources(List<Notification.NotificationSource> sources) {
        List<Notification> notifications = notificationRepository.findBySourceIn(sources);
        List<Notification> resultNotifications = new ArrayList<>();

        notifications.forEach(notification -> {
            if (notification.getSentCount() < notification.getCount()) {
                resultNotifications.add(notification); // Add to result list
                notification.setSentCount(notification.getSentCount() + 1); // Increment count
                notificationRepository.save(notification); // Save updated notification
            } else {
                System.out.println("Notification with ID " + notification.getId() + " has reached its limit.");
            }
        });

        return resultNotifications;
    }

    // Retrieve notifications by sources and player ID
    public List<Notification> getNotificationsBySourcesAndPlayerId(List<Notification.NotificationSource> sources, Long playerId) {
        List<Notification> notifications = notificationRepository.findBySourceInAndPlayerId(sources, playerId);
        List<Notification> resultNotifications = new ArrayList<>();

        notifications.forEach(notification -> {
            if (notification.getSentCount() < notification.getCount()) {
                resultNotifications.add(notification); // Add to result list
                notification.setSentCount(notification.getSentCount() + 1); // Increment count
                notificationRepository.save(notification); // Save updated notification
            } else {
                System.out.println("Notification with ID " + notification.getId() + " has reached its limit.");
            }
        });

        return resultNotifications;
    }

    public Notification updateNotification(Long id, NotificationRequest notificationRequest) {
        Notification existingNotification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));

        try {
            existingNotification.setContent(notificationRequest.getContent());
            Notification.NotificationSource source = Notification.NotificationSource.valueOf(notificationRequest.getSource().toUpperCase());
            existingNotification.setSource(source);
            existingNotification.setPlayerId(notificationRequest.getPlayerId());
            Instant scheduleTimeInstant = notificationRequest.getScheduleTime().toInstant(ZoneOffset.UTC);
            Instant expireTimeInstant = notificationRequest.getExpireTime().toInstant(ZoneOffset.UTC);
            existingNotification.setScheduleTime(scheduleTimeInstant);
            existingNotification.setExpireTime(expireTimeInstant);

            // Update sentCount if provided, otherwise keep the existing value
            int sentCount = notificationRequest.getSentCount() != null
                    ? notificationRequest.getSentCount()
                    : existingNotification.getSentCount();
            existingNotification.setSentCount(sentCount);

            return notificationRepository.save(existingNotification);

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid notification source: " + notificationRequest.getSource(), e);
        }
    }

    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new RuntimeException("Notification not found with ID: " + id);
        }
        notificationRepository.deleteById(id);
    }
}
