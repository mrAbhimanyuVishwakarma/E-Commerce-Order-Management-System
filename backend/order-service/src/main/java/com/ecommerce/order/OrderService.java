package com.ecommerce.order;

import com.ecommerce.order.dto.OrderItemRequestDto;
import com.ecommerce.order.dto.OrderRequestDto;
import com.ecommerce.order.dto.ProductDto;
import com.ecommerce.event.InventoryReservationRequestedEvent;
import com.ecommerce.event.OrderItemDto;
import com.ecommerce.order.outbox.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
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
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;
    
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
        List<OrderItemDto> eventItems = new ArrayList<>();

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
            eventItems.add(new OrderItemDto(product.getId(), itemReq.getQuantity(), product.getName(), product.getPrice(), subtotal));
        }

        order.setItems(items);
        order.setTotalAmount(totalAmount);
        
        Order savedOrder = orderRepository.save(order);

        // Save Event to Outbox
        InventoryReservationRequestedEvent event = new InventoryReservationRequestedEvent();
        event.setEventId(java.util.UUID.randomUUID().toString());
        event.setEventType("InventoryReservationRequestedEvent");
        event.setEventVersion(1);
        event.setCorrelationId(event.getEventId());
        event.setOccurredAt(java.time.LocalDateTime.now());
        event.setOrderId(savedOrder.getId());
        event.setUserId(userId);
        event.setItems(eventItems);

        try {
            com.ecommerce.order.outbox.OutboxEvent outboxEvent = new com.ecommerce.order.outbox.OutboxEvent();
            outboxEvent.setEventId(event.getEventId());
            outboxEvent.setEventType(event.getEventType());
            outboxEvent.setPayload(objectMapper.writeValueAsString(event));
            outboxEvent.setStatus("PENDING");
            outboxEventRepository.save(outboxEvent);
            System.out.println("Saved InventoryReservationRequestedEvent to outbox for Order ID " + savedOrder.getId());
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize outbox event", e);
        }

        return savedOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Transactional
    public void confirmOrder(com.ecommerce.event.InventoryReservedEvent event) {
        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + event.getOrderId()));
        
        if (order.getStatus() != OrderStatus.PENDING) {
            return;
        }
        
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        com.ecommerce.event.OrderConfirmedEvent confirmedEvent = new com.ecommerce.event.OrderConfirmedEvent();
        confirmedEvent.setEventId(java.util.UUID.randomUUID().toString());
        confirmedEvent.setEventType("OrderConfirmedEvent");
        confirmedEvent.setEventVersion(1);
        confirmedEvent.setCorrelationId(event.getCorrelationId());
        confirmedEvent.setOccurredAt(java.time.LocalDateTime.now());
        confirmedEvent.setOrderId(order.getId());
        confirmedEvent.setUserId(order.getUserId());
        confirmedEvent.setTotalAmount(order.getTotalAmount());
        confirmedEvent.setStatus(order.getStatus().name());
        confirmedEvent.setItems(event.getItems());

        saveOutboxEvent(confirmedEvent);
    }

    @Transactional
    public void rejectOrder(com.ecommerce.event.InventoryRejectedEvent event) {
        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + event.getOrderId()));
        
        if (order.getStatus() != OrderStatus.PENDING) {
            return;
        }

        order.setStatus(OrderStatus.REJECTED); // Assumes you have a REJECTED or CANCELLED status. If not, maybe FAILED?
        orderRepository.save(order);

        com.ecommerce.event.OrderRejectedEvent rejectedEvent = new com.ecommerce.event.OrderRejectedEvent();
        rejectedEvent.setEventId(java.util.UUID.randomUUID().toString());
        rejectedEvent.setEventType("OrderRejectedEvent");
        rejectedEvent.setEventVersion(1);
        rejectedEvent.setCorrelationId(event.getCorrelationId());
        rejectedEvent.setOccurredAt(java.time.LocalDateTime.now());
        rejectedEvent.setOrderId(order.getId());
        rejectedEvent.setUserId(order.getUserId());
        rejectedEvent.setStatus(order.getStatus().name());
        rejectedEvent.setReasonCode(event.getReasonCode());
        rejectedEvent.setReasonMessage(event.getReasonMessage());

        saveOutboxEvent(rejectedEvent);
    }

    private void saveOutboxEvent(com.ecommerce.event.BaseEvent event) {
        try {
            com.ecommerce.order.outbox.OutboxEvent outboxEvent = new com.ecommerce.order.outbox.OutboxEvent();
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
