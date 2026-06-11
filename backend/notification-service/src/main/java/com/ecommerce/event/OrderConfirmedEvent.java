package com.ecommerce.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OrderConfirmedEvent extends BaseEvent {
    private BigDecimal totalAmount;
    private String status;
    private List<OrderItemDto> items;
}
