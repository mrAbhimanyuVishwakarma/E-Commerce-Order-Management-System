package com.ecommerce.notification;

import com.ecommerce.order.event.OrderCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @KafkaListener(topics = "order-created", groupId = "ecommerce-group")
    public void handleOrderCreatedEvent(OrderCreatedEvent event) {
        System.out.println("NotificationService: Received order-created event for Order ID " + event.getOrderId());
        System.out.println("NotificationService: Sending order confirmation to " + event.getUserEmail());
        // Future Enhancement: Email/SMS notification
    }
}
