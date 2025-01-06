package com.example.chatbot.controller;

import com.example.chatbot.dto.NotificationRequest;
import com.example.chatbot.entity.Notification;
import com.example.chatbot.service.NotificationService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.time.ZoneOffset;
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/add")
    public ResponseEntity<?> addNotification(@RequestBody NotificationRequest notificationRequest) {
        try {
            // Map the NotificationRequest to a Notification entity
            Notification notification = new Notification();
            notification.setContent(notificationRequest.getContent());

            // Convert source to enum and validate
            Notification.NotificationSource source;
            try {
                source = Notification.NotificationSource.valueOf(notificationRequest.getSource().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid source type: " + notificationRequest.getSource());
            }
            notification.setSource(source);

            notification.setPlayerId(notificationRequest.getPlayerId());

            // Convert scheduleTime and expireTime to Instant
            Instant scheduleTimeInstant = notificationRequest.getScheduleTime().toInstant(ZoneOffset.UTC);
            Instant expireTimeInstant = notificationRequest.getExpireTime().toInstant(ZoneOffset.UTC);
            notification.setScheduleTime(scheduleTimeInstant);
            notification.setExpireTime(expireTimeInstant);

            // Set notification sentCount and static count
            notification.setSentCount(notificationRequest.getSentCount() != null 
                    ? notificationRequest.getSentCount() 
                    : 1); // Default to 1
            notification.setCount(notificationRequest.getCount());

            // Save the notification
            Notification savedNotification = notificationService.addNotification(notification);

            // Return success response
            return ResponseEntity.status(HttpStatus.CREATED).body(savedNotification);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/source")
    public ResponseEntity<List<Notification>> getNotificationsBySources(
            @RequestParam List<String> sources,
            @RequestParam(required = false) Long playerId) {

        // Convert source strings to enum values (case-insensitive)
        List<Notification.NotificationSource> enumSources = sources.stream()
                .map(source -> Notification.NotificationSource.valueOf(source.toUpperCase()))
                .toList();

        // Retrieve notifications based on sources and optionally by playerId
        List<Notification> notifications;
        if (playerId != null) {
            // If playerId is provided, filter by both sources and playerId
            notifications = notificationService.getNotificationsBySourcesAndPlayerId(enumSources, playerId);
        } else {
            // Otherwise, filter only by sources
            notifications = notificationService.getNotificationsBySources(enumSources);
        }

        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(
            @PathVariable Long id,
            @RequestBody NotificationRequest notificationRequest) {
        Notification updatedNotification = notificationService.updateNotification(
                id, 
                notificationRequest
        );

        return ResponseEntity.ok(updatedNotification);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
