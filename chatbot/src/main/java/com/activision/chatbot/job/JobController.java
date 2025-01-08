package com.activision.chatbot.job;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.activision.chatbot.entity.Notification;
import com.activision.chatbot.entity.Notification.NotificationSource;
import com.activision.chatbot.entity.Notification.NotificationStatus;
import com.activision.chatbot.repo.NotificationRepository;
import com.activision.chatbot.service.EmailService;

@RestController
@RequestMapping("/scheduler")
public class JobController {

	private static final org.slf4j.Logger LOG = org.slf4j.LoggerFactory.getLogger(JobController.class);
	
	@Autowired
	EmailService emailService;
	
	@Autowired
	NotificationRepository notificationRepository;

	@PostMapping("/trigger-email-job")
	public String sendEmailJob(@RequestBody Notification notification) throws Exception {
		try {	
			if(notification.getScheduleTime() == null && notification.getExpireTime() == null) {
				notification.setNotificationStatus(NotificationStatus.SENT);
				notification.setSource(NotificationSource.EMAIL);
				LOG.info("JobController.sendEmailJob({}) => Email sent sucessfully for player !!!!!!  " + notification.getPlayerId());
				emailService.sendEmail(notification);
			}
			notificationRepository.save(notification);
			LOG.info("JobController.sendEmailJob({}) => Email Job Saved sucessfully for player !!!!!!  " + notification.getPlayerId());
			return "Job scheduled successfully";
		} catch (Exception e) {
			LOG.error("JobController.sendEmailJob({}) => Email failed to sent for player !!!!!!" + notification.getPlayerId());
			throw e;
		}
	}
}