package com.activision.chatbot.job;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import com.activision.chatbot.repo.NotificationRepository;

@Configuration
public class QuartzJobService {
	
	private static final Logger LOG = LoggerFactory.getLogger(QuartzJobService.class);

	@Autowired
	@Lazy
	Scheduler scheduler;
	
	@Autowired
	NotificationRepository notificationRepo;

	@Bean
    public JobDetail batchJobDetail() {
        return JobBuilder
            .newJob()
            .ofType(EmailJob.class)
            .requestRecovery(false)
            .storeDurably(true)
            .withDescription("email job that sends email for every 5 minutes")
            .withIdentity(new JobKey("NOTIFICATION_EMAIL_Job"))
            .build();
    }

    @Bean
    public Trigger batchJobTrigger() {
        return TriggerBuilder
            .newTrigger()
            .forJob(batchJobDetail())
            .withSchedule(SimpleScheduleBuilder.repeatMinutelyForever(1))
            .withIdentity("NOTIFICATION_EMAIL_Job_Trigger")
            .build();
    }
	
}