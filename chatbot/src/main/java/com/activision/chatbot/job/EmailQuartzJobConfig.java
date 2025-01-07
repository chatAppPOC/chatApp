package com.activision.chatbot.job;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.activision.chatbot.entity.Notification;
import com.activision.chatbot.service.EmailService;
import com.activision.chatbot.utility.CronUtility;

@Configuration
public class EmailQuartzJobConfig {

	@Autowired
	Scheduler scheduler;

	@Autowired
	EmailService emailService;

	public JobDetail createJobDetail(Notification notification) {
        return JobBuilder.newJob(EmailJob.class)
                .withIdentity("emailJob_" + notification.getPlayerId())
                .usingJobData("playerId", notification.getPlayerId() != null ? notification.getPlayerId().toString() : "")
                .usingJobData("content", notification.getContent())
                .storeDurably()
                .build();
    }

	public Trigger createTrigger(Notification notification) {	
        CronUtility.cronConvertor(
                Instant.now(),
                ZoneId.systemDefault(),
                CronUtility.Recurrence.DAILY,
                List.of()
        );

        return TriggerBuilder.newTrigger()
                .forJob(createJobDetail(notification))
                .withIdentity("emailTrigger_" + notification.getId())
                .startNow()
                //.withSchedule(CronScheduleBuilder.cronSchedule(cronExpression))
                .build();
    }

	public void scheduleEmailJob(Notification notification) throws SchedulerException {
        JobDetail jobDetail = createJobDetail(notification);
        Trigger trigger = createTrigger(notification);

        scheduler.scheduleJob(jobDetail, trigger);
    }

}