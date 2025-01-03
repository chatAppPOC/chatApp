package com.example.chatbot.service;

import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.chatbot.entity.Notification;
import com.example.chatbot.entity.Player;
import com.example.chatbot.repo.PlayerRepository;

@Service
public class EmailService {

	private static final org.slf4j.Logger LOG = org.slf4j.LoggerFactory.getLogger(EmailService.class);

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	PlayerRepository playerRepository;
	
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
}
