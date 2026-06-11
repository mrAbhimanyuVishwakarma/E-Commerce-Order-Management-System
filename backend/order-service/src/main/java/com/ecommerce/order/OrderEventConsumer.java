package com.ecommerce.order;

import com.ecommerce.event.InventoryRejectedEvent;
import com.ecommerce.event.InventoryReservedEvent;
import com.ecommerce.order.outbox.ProcessedEvent;
import com.ecommerce.order.outbox.ProcessedEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {

    private final OrderService orderService;
    private final ProcessedEventRepository processedEventRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "inventory-reserved", groupId = "order-service-group")
    @Transactional
    public void consumeInventoryReserved(String payload) {
        try {
            InventoryReservedEvent event = objectMapper.readValue(payload, InventoryReservedEvent.class);
            if (processedEventRepository.existsById(event.getEventId())) {
                log.info("Event {} already processed", event.getEventId());
                return;
            }
            orderService.confirmOrder(event);
            processedEventRepository.save(new ProcessedEvent(event.getEventId(), java.time.LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Failed to process inventory-reserved event", e);
            throw new RuntimeException("Failed to process event", e);
        }
    }

    @KafkaListener(topics = "inventory-rejected", groupId = "order-service-group")
    @Transactional
    public void consumeInventoryRejected(String payload) {
        try {
            InventoryRejectedEvent event = objectMapper.readValue(payload, InventoryRejectedEvent.class);
            if (processedEventRepository.existsById(event.getEventId())) {
                log.info("Event {} already processed", event.getEventId());
                return;
            }
            orderService.rejectOrder(event);
            processedEventRepository.save(new ProcessedEvent(event.getEventId(), java.time.LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Failed to process inventory-rejected event", e);
            throw new RuntimeException("Failed to process event", e);
        }
    }
}
