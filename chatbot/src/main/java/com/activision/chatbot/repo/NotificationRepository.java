package com.activision.chatbot.repo;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.activision.chatbot.entity.Notification;
import com.activision.chatbot.entity.Notification.NotificationSource;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find notifications by sources and playerId
    @Query("SELECT n FROM Notification n JOIN Player p ON n.playerId = p.id WHERE p.id = :playerId AND n.source IN :sources")
    List<Notification> findByPlayerIdAndSourceIn(Long playerId, List<NotificationSource> sources);

    // Find notifications by sources, playerId, and sentCount less than count
    @Query("SELECT n FROM Notification n WHERE n.source IN :sources AND n.playerId = :playerId " +
           "AND n.sentCount < n.count")
    List<Notification> findBySourceInAndPlayerIdAndSentCountLessThanCount(
            @Param("sources") List<NotificationSource> sources, 
            @Param("playerId") Long playerId);

            
    @Query(value = "SELECT * FROM Notification  \r\n"
			+ "	WHERE scheduled_time <= :currentTime \r\n"
			+ "	AND (expire_time IS NULL OR expire_time > :currentTime) AND notification_status NOT IN ( 'SENT')" , nativeQuery = true)
    List<Notification> findNotificationsToSend(@Param("currentTime") Instant currentTime);
    List<Notification> findBySourceIn(List<String> sources);

    // Fetch notifications by source, playerId, and sentCount condition
    List<Notification> findAllBySourceIn(List<NotificationSource> sources);

}
