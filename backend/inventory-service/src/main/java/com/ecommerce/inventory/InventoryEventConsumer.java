package com.ecommerce.inventory;

import com.ecommerce.event.InventoryReservationRequestedEvent;
import com.ecommerce.event.InventoryReleaseRequestedEvent;
import com.ecommerce.inventory.outbox.ProcessedEvent;
import com.ecommerce.inventory.outbox.ProcessedEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryEventConsumer {

    private final InventoryService inventoryService;
    private final ProcessedEventRepository processedEventRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "inventory-reservation-requested", groupId = "inventory-service-group")
    public void consumeReservationRequested(String payload) {
        try {
            InventoryReservationRequestedEvent event = objectMapper.readValue(payload, InventoryReservationRequestedEvent.class);
            if (processedEventRepository.existsById(event.getEventId())) {
                log.info("Event {} already processed", event.getEventId());
                return;
            }
            inventoryService.reserveInventory(event);
            processedEventRepository.save(new ProcessedEvent(event.getEventId(), java.time.LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Failed to process inventory-reservation-requested event", e);
            throw new RuntimeException("Failed to process event", e);
        }
    }

    @KafkaListener(topics = "inventory-release-requested", groupId = "inventory-service-group")
    public void consumeReleaseRequested(String payload) {
        try {
            InventoryReleaseRequestedEvent event = objectMapper.readValue(payload, InventoryReleaseRequestedEvent.class);
            if (processedEventRepository.existsById(event.getEventId())) {
                log.info("Event {} already processed", event.getEventId());
                return;
            }
            inventoryService.releaseInventory(event);
            processedEventRepository.save(new ProcessedEvent(event.getEventId(), java.time.LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Failed to process inventory-release-requested event", e);
            throw new RuntimeException("Failed to process event", e);
        }
    }
}
