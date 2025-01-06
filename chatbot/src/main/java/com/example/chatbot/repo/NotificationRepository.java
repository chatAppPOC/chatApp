package com.example.chatbot.repo;

import com.example.chatbot.entity.Notification;
import com.example.chatbot.entity.Notification.NotificationSource;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find notifications by sources
    List<Notification> findBySourceIn(List<NotificationSource> sources);

    // Find notifications by sources and playerId
    @Query("SELECT n FROM Notification n WHERE n.source IN :sources AND n.playerId = :playerId")
    List<Notification> findBySourceInAndPlayerId(@Param("sources") List<NotificationSource> sources,
                                                 @Param("playerId") Long playerId);

    // Find notifications by sources, playerId, and sentCount less than count
    @Query("SELECT n FROM Notification n WHERE n.source IN :sources AND n.playerId = :playerId " +
           "AND n.sentCount < n.count")
    List<Notification> findBySourceInAndPlayerIdAndSentCountLessThanCount(
            @Param("sources") List<NotificationSource> sources, 
            @Param("playerId") Long playerId);
}
