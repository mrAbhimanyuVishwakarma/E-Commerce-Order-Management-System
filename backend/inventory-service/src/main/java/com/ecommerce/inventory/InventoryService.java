package com.ecommerce.inventory;

import com.ecommerce.event.*;
import com.ecommerce.inventory.outbox.OutboxEvent;
import com.ecommerce.inventory.outbox.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryReservationRepository reservationRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void reserveInventory(InventoryReservationRequestedEvent event) {
        // Validation
        if (reservationRepository.findByOrderId(event.getOrderId()).isPresent()) {
            return; // Already processed
        }

        List<InventoryReservationItem> resItems = new ArrayList<>();
        InventoryReservation reservation = new InventoryReservation();
        reservation.setOrderId(event.getOrderId());
        reservation.setStatus("RESERVED");

        boolean allAvailable = true;
        String rejectReason = "";

        // First pass: check availability without mutating
        for (OrderItemDto item : event.getItems()) {
            Inventory inv = inventoryRepository.findByProductId(item.getProductId()).orElse(null);
            if (inv == null) {
                allAvailable = false;
                rejectReason = "Product " + item.getProductId() + " not found in inventory";
                break;
            }
            if (inv.getAvailableQuantity() < item.getQuantity()) {
                allAvailable = false;
                rejectReason = "Insufficient stock for product " + item.getProductId();
                break;
            }
        }

        if (allAvailable) {
            // Second pass: mutate and save
            for (OrderItemDto item : event.getItems()) {
                Inventory inv = inventoryRepository.findByProductId(item.getProductId()).get();
                inv.setAvailableQuantity(inv.getAvailableQuantity() - item.getQuantity());
                inv.setReservedQuantity(inv.getReservedQuantity() + item.getQuantity());
                inventoryRepository.save(inv);

                InventoryReservationItem resItem = new InventoryReservationItem();
                resItem.setReservation(reservation);
                resItem.setProductId(item.getProductId());
                resItem.setQuantity(item.getQuantity());
                resItems.add(resItem);
            }

            reservation.setItems(resItems);
            reservationRepository.save(reservation);

            // Publish reserved event
            InventoryReservedEvent resEvent = new InventoryReservedEvent();
            resEvent.setEventId(java.util.UUID.randomUUID().toString());
            resEvent.setEventType("InventoryReservedEvent");
            resEvent.setEventVersion(1);
            resEvent.setCorrelationId(event.getCorrelationId());
            resEvent.setOccurredAt(java.time.LocalDateTime.now());
            resEvent.setOrderId(event.getOrderId());
            resEvent.setUserId(event.getUserId());
            resEvent.setItems(event.getItems());
            saveOutboxEvent(resEvent);
        } else {
            // Publish rejected event
            InventoryRejectedEvent rejEvent = new InventoryRejectedEvent();
            rejEvent.setEventId(java.util.UUID.randomUUID().toString());
            rejEvent.setEventType("InventoryRejectedEvent");
            rejEvent.setEventVersion(1);
            rejEvent.setCorrelationId(event.getCorrelationId());
            rejEvent.setOccurredAt(java.time.LocalDateTime.now());
            rejEvent.setOrderId(event.getOrderId());
            rejEvent.setUserId(event.getUserId());
            rejEvent.setItems(event.getItems());
            rejEvent.setReasonCode("INSUFFICIENT_STOCK");
            rejEvent.setReasonMessage(rejectReason);
            saveOutboxEvent(rejEvent);
        }
    }

    @Transactional
    public void releaseInventory(InventoryReleaseRequestedEvent event) {
        InventoryReservation reservation = reservationRepository.findByOrderId(event.getOrderId()).orElse(null);
        if (reservation == null) {
            InventoryReleaseRejectedEvent rejEvent = new InventoryReleaseRejectedEvent();
            rejEvent.setEventId(java.util.UUID.randomUUID().toString());
            rejEvent.setEventType("InventoryReleaseRejectedEvent");
            rejEvent.setEventVersion(1);
            rejEvent.setCorrelationId(event.getCorrelationId());
            rejEvent.setOccurredAt(java.time.LocalDateTime.now());
            rejEvent.setOrderId(event.getOrderId());
            rejEvent.setUserId(event.getUserId());
            rejEvent.setReasonCode("RESERVATION_NOT_FOUND");
            rejEvent.setReasonMessage("No reservation found for order " + event.getOrderId());
            saveOutboxEvent(rejEvent);
            return;
        }

        if ("RELEASED".equals(reservation.getStatus())) {
            return; // Already released
        }

        for (InventoryReservationItem item : reservation.getItems()) {
            Inventory inv = inventoryRepository.findByProductId(item.getProductId()).orElse(null);
            if (inv != null) {
                inv.setAvailableQuantity(inv.getAvailableQuantity() + item.getQuantity());
                inv.setReservedQuantity(inv.getReservedQuantity() - item.getQuantity());
                inventoryRepository.save(inv);
            }
        }

        reservation.setStatus("RELEASED");
        reservationRepository.save(reservation);

        InventoryReleasedEvent relEvent = new InventoryReleasedEvent();
        relEvent.setEventId(java.util.UUID.randomUUID().toString());
        relEvent.setEventType("InventoryReleasedEvent");
        relEvent.setEventVersion(1);
        relEvent.setCorrelationId(event.getCorrelationId());
        relEvent.setOccurredAt(java.time.LocalDateTime.now());
        relEvent.setOrderId(event.getOrderId());
        relEvent.setUserId(event.getUserId());
        relEvent.setItems(event.getItems());
        saveOutboxEvent(relEvent);
    }

    private void saveOutboxEvent(BaseEvent event) {
        try {
            OutboxEvent outboxEvent = new OutboxEvent();
            outboxEvent.setEventId(event.getEventId());
            outboxEvent.setEventType(event.getEventType());
            outboxEvent.setPayload(objectMapper.writeValueAsString(event));
            outboxEvent.setStatus("PENDING");
            outboxEventRepository.save(outboxEvent);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize outbox event", e);
        }
    }
}
