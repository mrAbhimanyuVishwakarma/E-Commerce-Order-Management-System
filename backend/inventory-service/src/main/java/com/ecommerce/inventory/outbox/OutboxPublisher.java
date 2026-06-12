package com.ecommerce.inventory.outbox;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OutboxPublisher {

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void publishPendingEvents() {
        List<OutboxEvent> pendingEvents = outboxEventRepository.findByStatusOrderByCreatedAtAsc("PENDING");
        
        for (OutboxEvent outboxEvent : pendingEvents) {
            try {
                // Publish to Kafka using the eventType as the topic name or map it
                String topic = getTopicForEventType(outboxEvent.getEventType());
                kafkaTemplate.send(topic, outboxEvent.getEventId(), outboxEvent.getPayload())
                        .get(); // Blocking call to ensure persistence
                
                outboxEvent.setStatus("PUBLISHED");
                outboxEventRepository.save(outboxEvent);
                log.info("Published event {} to topic {}", outboxEvent.getEventId(), topic);
            } catch (Exception e) {
                log.error("Failed to publish event {}: {}", outboxEvent.getEventId(), e.getMessage());
                outboxEvent.setRetryCount(outboxEvent.getRetryCount() + 1);
                outboxEvent.setFailureDetails(e.getMessage());
                if (outboxEvent.getRetryCount() >= 5) {
                    outboxEvent.setStatus("FAILED");
                }
                outboxEventRepository.save(outboxEvent);
            }
        }
    }

    private String getTopicForEventType(String eventType) {
        return switch (eventType) {
            case "InventoryReservedEvent" -> "inventory-reserved";
            case "InventoryRejectedEvent" -> "inventory-rejected";
            case "InventoryReleasedEvent" -> "inventory-released";
            case "InventoryReleaseRejectedEvent" -> "inventory-release-rejected";
            default -> throw new IllegalArgumentException("Unknown event type: " + eventType);
        };
    }
}
