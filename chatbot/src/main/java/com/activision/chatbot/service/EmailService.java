package com.activision.chatbot.service;

import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.activision.chatbot.entity.Notification;
import com.activision.chatbot.entity.Notification.NotificationStatus;
import com.activision.chatbot.entity.Player;
import com.activision.chatbot.repo.NotificationRepository;
import com.activision.chatbot.repo.PlayerRepository;

@Service
public class EmailService {

	private static final org.slf4j.Logger LOG = org.slf4j.LoggerFactory.getLogger(EmailService.class);

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	PlayerRepository playerRepository;
	
	@Autowired
	NotificationRepository notificationRepo;
	
	@Value("$(spring.mail.username)")
	private String fromMailId;

	public void sendEmail(Notification notification) throws Exception {
		try {
			List<Player> playersToEmail;
			if (notification.getPlayerId() != null) {
				Optional<Player> player = playerRepository.findById(notification.getPlayerId());
				if (player == null) {
					throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Player details does not exist");
				}
				playersToEmail = List.of(player.get());
			} else {
				playersToEmail = playerRepository.findAll();
				if (playersToEmail.isEmpty()) {
					throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No players found for group email");
				}
			}
			for (var player : playersToEmail) {
				SimpleMailMessage mailMessage = new SimpleMailMessage();
				mailMessage.setTo(player.getEmail());
				mailMessage.setFrom(fromMailId);
				mailMessage.setText(notification.getContent());
				mailMessage.setSubject("Java Mail Testing");
				LOG.info("EmailService.sendEmail(email with subject: {}) sent sucessfully to  => {}", notification.getContent(), player.getEmail());
				mailSender.send(mailMessage);
			}
		} catch (Exception e) {
			LOG.error("EmailService.sendEmail(email with subject: {}) => {}:", notification.getContent(), e);
			throw e;
		}
	}
	
	public void processNotification(Notification notification) {
        try {
            if (notification.getSentCount() < notification.getCount()) {
                sendEmail(notification);
                notification.setSentCount(notification.getSentCount() + 1);
                notificationRepo.save(notification);
                LOG.info("Email sent successfully to PlayerId: {}", notification.getPlayerId());
            } else {
            	notification.setNotificationStatus(NotificationStatus.SENT);
				sendEmail(notification);
                LOG.info("Notification for PlayerId {} has reached the maximum count.", notification.getPlayerId());
            }
        } catch (Exception e) {
            LOG.error("Failed to send email for PlayerId: {}", notification.getPlayerId(), e);
        }
    }
}
