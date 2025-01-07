package com.activision.chatbot.job;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;

import com.activision.chatbot.entity.Notification;
import com.activision.chatbot.service.EmailService;

public class EmailJob implements Job {

	@Autowired
	private EmailService emailService;

	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		try {
			JobDataMap dataMap = context.getJobDetail().getJobDataMap();
			String playerId = dataMap.getString("playerId");
			String content = dataMap.getString("content");

			Notification notification = new Notification();
			notification.setContent(content);
			notification.setPlayerId(playerId != null && !playerId.isEmpty() ? Long.parseLong(playerId) : null);

			emailService.sendEmail(notification);
		} catch (Exception e) {
			throw new JobExecutionException("Error while sending email", e);
		}
	}
}
