package com.activision.chatbot.job;

import java.time.Instant;
import java.util.List;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;

import com.activision.chatbot.entity.Notification;
import com.activision.chatbot.repo.NotificationRepository;
import com.activision.chatbot.service.EmailService;

public class EmailJob extends QuartzJobBean {
	
	private static final Logger LOG = LoggerFactory.getLogger(EmailJob.class);

	@Autowired
	private EmailService emailService;
	
	@Autowired
	NotificationRepository notificationRepo;
	
	@Autowired
	QuartzJobService quartzJobService;

	@Override
	public void executeInternal(JobExecutionContext context) throws JobExecutionException {
		try {
			//
			List<Notification> notifications = notificationRepo.findNotificationsToSend(Instant.now());		
			for(Notification notify : notifications) {
                    Instant now = Instant.now();
                    if (now.isAfter(notify.getScheduledTime()) && now.isBefore(notify.getExpireTime())) {
                    	emailService.processNotification(notify);
                    
                } else {
                    // If scheduledTime and expireTime are null, send the email immediately
                	emailService.processNotification(notify);
                }
			}
		} catch (Exception e) {
			LOG.error("EmailJob.executeInternal({} Currently No Emails are there to sent in the Schedule time!!!)", context);
		}
		
	}

	

}
