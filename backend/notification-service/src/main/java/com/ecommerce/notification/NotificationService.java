package com.ecommerce.notification;

import com.ecommerce.event.OrderConfirmedEvent;
import com.ecommerce.event.OrderRejectedEvent;
import com.ecommerce.notification.outbox.ProcessedEvent;
import com.ecommerce.notification.outbox.ProcessedEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final ProcessedEventRepository processedEventRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "order-confirmed", groupId = "notification-service-group")
    @Transactional
    public void handleOrderConfirmedEvent(String payload) {
        try {
            OrderConfirmedEvent event = objectMapper.readValue(payload, OrderConfirmedEvent.class);
            if (processedEventRepository.existsById(event.getEventId())) {
                log.info("Event {} already processed", event.getEventId());
                return;
            }
            log.info("NotificationService: Sending order confirmation to user {}", event.getUserId());
            // Future Enhancement: Email/SMS notification
            processedEventRepository.save(new ProcessedEvent(event.getEventId(), java.time.LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Failed to process order-confirmed event", e);
            throw new RuntimeException("Failed to process event", e);
        }
    }

    @KafkaListener(topics = "order-rejected", groupId = "notification-service-group")
    @Transactional
    public void handleOrderRejectedEvent(String payload) {
        try {
            OrderRejectedEvent event = objectMapper.readValue(payload, OrderRejectedEvent.class);
            if (processedEventRepository.existsById(event.getEventId())) {
                log.info("Event {} already processed", event.getEventId());
                return;
            }
            log.info("NotificationService: Sending order rejection to user {}. Reason: {}", event.getUserId(), event.getReasonMessage());
            // Future Enhancement: Email/SMS notification
            processedEventRepository.save(new ProcessedEvent(event.getEventId(), java.time.LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Failed to process order-rejected event", e);
            throw new RuntimeException("Failed to process event", e);
        }
    }
}
