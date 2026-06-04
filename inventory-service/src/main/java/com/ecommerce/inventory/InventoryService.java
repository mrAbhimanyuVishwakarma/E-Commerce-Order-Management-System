package com.ecommerce.inventory;

import com.ecommerce.order.event.OrderCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {

    @KafkaListener(topics = "order-created", groupId = "ecommerce-group")
    public void handleOrderCreatedEvent(OrderCreatedEvent event) {
        System.out.println("InventoryService: Received order-created event for Order ID " + event.getOrderId());
        System.out.println("InventoryService: Reducing stock for Product ID " + event.getProductId() + " by " + event.getQuantity());
        // In a real application, we would check and reduce stock in the DB here
    }
}
