package com.activision.chatbot.controller;

import com.activision.chatbot.dto.NotificationRequest;
import com.activision.chatbot.entity.Notification;
import com.activision.chatbot.entity.Notification.NotificationSource;
import com.activision.chatbot.entity.Player;
import com.activision.chatbot.repo.PlayerRepository;
import com.activision.chatbot.service.NotificationService;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional; // Make sure this import is correct

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

	@Autowired
	private NotificationService notificationService;
	@Autowired
	private PlayerRepository playerRepository;

	@PostMapping("/add")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?> addNotification(@RequestBody NotificationRequest notificationRequest) {
		try {
			List<NotificationSource> sources = notificationRequest.getSource();
			List<Notification> savedNotifications = new ArrayList<>();

			// Iterate over sources and create notifications
			for (NotificationSource source : sources) {
				Notification notification = new Notification();
				notification.setContent(notificationRequest.getContent());

				// Directly set the source
				notification.setSource(source);
				notification.setPlayerId(notificationRequest.getPlayerId());

				// Check if player exists
				Optional<Player> playerOptional = playerRepository.findById(notificationRequest.getPlayerId());
				if (playerOptional.isEmpty()) {
					return ResponseEntity.status(HttpStatus.NOT_FOUND)
							.body("Player with ID " + notificationRequest.getPlayerId() + " not found.");
				}

				// Convert scheduleTime and expireTime to Instant
				Instant scheduleTimeInstant = notificationRequest.getScheduleTime().toInstant(ZoneOffset.UTC);
				Instant expireTimeInstant = notificationRequest.getExpireTime().toInstant(ZoneOffset.UTC);
				notification.setScheduledTime(scheduleTimeInstant);
				notification.setExpireTime(expireTimeInstant);

				// Set notification sentCount and static count
				notification.setSentCount(
						notificationRequest.getSentCount() != null ? notificationRequest.getSentCount() : 1); // Default to 1 if not provided																								
				notification.setCount(notificationRequest.getCount());

				// Save the notification
				Notification savedNotification = notificationService.addNotification(notification);
				savedNotifications.add(savedNotification);
			}

			// Return success response with saved notifications
			return ResponseEntity.status(HttpStatus.CREATED).body(savedNotifications);

		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request: " + e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
		}
	}

	@GetMapping("/source")
	@PreAuthorize("hasAuthority('PLAYER')")
	public ResponseEntity<?> getNotificationsBySources(@RequestParam List<NotificationSource> sources,
			@RequestParam(required = false) Long playerId) {

		List<Notification> notifications;
		if (playerId != null) {
			notifications = notificationService.getNotificationsBySourcesAndPlayerId(sources, playerId);
		} else {
			notifications = notificationService.getNotificationsBySources(sources);
		}

		Map<String, Object> response = new HashMap<>();
		response.put("notifications", notifications);

		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<Notification> updateNotification(@PathVariable Long id,
			@RequestBody NotificationRequest notificationRequest) {
		Notification updatedNotification = notificationService.updateNotification(id, notificationRequest);

		return ResponseEntity.ok(updatedNotification);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
		notificationService.deleteNotification(id);
		return ResponseEntity.noContent().build();
	}
}
