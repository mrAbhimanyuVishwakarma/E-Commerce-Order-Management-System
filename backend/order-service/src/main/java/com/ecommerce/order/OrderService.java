package com.ecommerce.order;

import com.ecommerce.order.dto.OrderRequestDto;
import com.ecommerce.order.dto.ProductDto;
import com.ecommerce.order.dto.UserDto;
import com.ecommerce.order.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * OrderService
 * Explaining design decision: In Phase 4, OrderService uses RestTemplate to communicate with
 * other microservices (user-service, product-service) to validate the order, and Kafka for async events.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String ORDER_TOPIC = "order-created";
    
    @org.springframework.beans.factory.annotation.Value("${product.service.url:http://localhost:8082/api/products/}")
    private String productServiceUrl;
    
    // Assuming auth is handled gracefully or bypassed for internal calls in this demo
    // We would ideally pass the JWT token in headers for internal calls.

    @Transactional
    public Order createOrder(OrderRequestDto requestDto) {
        // 1. Fetch Product
        ProductDto product = restTemplate.getForObject(productServiceUrl + requestDto.getProductId(), ProductDto.class);
        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        // 2. Mock User info for now since we don't have token propagation setup
        // In a real microservices scenario with JWT, we decode it from SecurityContext.
        Long userId = requestDto.getUserId();
        String userEmail = "customer@example.com"; // Mocked for simplicity in this step

        // 3. Calculate amount and save order
        Double totalAmount = product.getPrice() * requestDto.getQuantity();
        Order order = new Order();
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setStatus("COMPLETED");
        Order savedOrder = orderRepository.save(order);

        // 4. Publish Event to Kafka
        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getId(),
                userId,
                product.getId(),
                requestDto.getQuantity(),
                userEmail
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
