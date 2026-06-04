package com.ecommerce.order;

import com.ecommerce.order.dto.OrderRequestDto;
import com.ecommerce.order.event.OrderCreatedEvent;
import com.ecommerce.product.Product;
import com.ecommerce.product.ProductService;
import com.ecommerce.user.User;
import com.ecommerce.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * OrderService
 * Explaining design decision: In Phase 3, we decouple OrderService from Inventory and Notification
 * services by publishing an event to Kafka.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final UserService userService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String ORDER_TOPIC = "order-created";

    @Transactional
    public Order createOrder(OrderRequestDto requestDto) {
        // 1. Fetch Product
        Product product = productService.getProductById(requestDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2. Fetch User
        User user = userService.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Note: In an event-driven architecture, we save the order first (maybe as PENDING),
        // and then publish an event. For simplicity in this demo, we assume we want to process it.
        // If inventory fails later, a compensating transaction would be needed (Saga pattern).

        // 3. Calculate amount and save order
        Double totalAmount = product.getPrice() * requestDto.getQuantity();
        Order order = new Order();
        order.setUserId(user.getId());
        order.setTotalAmount(totalAmount);
        order.setStatus("COMPLETED");
        Order savedOrder = orderRepository.save(order);

        // 4. Publish Event to Kafka
        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getId(),
                user.getId(),
                product.getId(),
                requestDto.getQuantity(),
                user.getEmail()
        );
        kafkaTemplate.send(ORDER_TOPIC, String.valueOf(savedOrder.getId()), event);
        System.out.println("Published order-created event for Order ID " + savedOrder.getId());

        return savedOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }
}
