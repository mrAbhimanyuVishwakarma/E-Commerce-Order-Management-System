package com.ecommerce.order;

import com.ecommerce.order.dto.OrderItemRequestDto;
import com.ecommerce.order.dto.OrderRequestDto;
import com.ecommerce.order.dto.ProductDto;
import com.ecommerce.order.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String ORDER_TOPIC = "order-created";
    
    @org.springframework.beans.factory.annotation.Value("${product.service.url:http://localhost:8082/api/products/}")
    private String productServiceUrl;
    
    @Transactional
    public Order createOrder(OrderRequestDto requestDto) {
        // Fallback for backward compatibility
        List<OrderItemRequestDto> requestItems = requestDto.getItems();
        if (requestItems == null || requestItems.isEmpty()) {
            if (requestDto.getProductId() != null && requestDto.getQuantity() != null) {
                OrderItemRequestDto item = new OrderItemRequestDto();
                item.setProductId(requestDto.getProductId());
                item.setQuantity(requestDto.getQuantity());
                requestItems = List.of(item);
            } else {
                throw new IllegalArgumentException("Order must contain at least one item");
            }
        }

        // Mock User info for now since token propagation setup belongs to the security phase
        // TODO: Extract userId from JWT SecurityContext.
        Long userId = requestDto.getUserId();
        String userEmail = "customer@example.com"; 

        Order order = new Order();
        order.setUserId(userId);
        order.setStatus(OrderStatus.PENDING);
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();
        List<OrderCreatedEvent.OrderItemDto> eventItems = new ArrayList<>();

        for (OrderItemRequestDto itemReq : requestItems) {
            if (itemReq.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than zero");
            }
            
            ProductDto product = restTemplate.getForObject(productServiceUrl + itemReq.getProductId(), ProductDto.class);
            if (product == null) {
                throw new RuntimeException("Product not found with ID: " + itemReq.getProductId());
            }

            BigDecimal subtotal = product.getPrice().multiply(new BigDecimal(itemReq.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setSubtotal(subtotal);
            
            items.add(orderItem);
            eventItems.add(new OrderCreatedEvent.OrderItemDto(product.getId(), itemReq.getQuantity()));
        }

        order.setItems(items);
        order.setTotalAmount(totalAmount);
        
        Order savedOrder = orderRepository.save(order);

        // Publish Event to Kafka
        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getId(),
                userId,
                eventItems,
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
