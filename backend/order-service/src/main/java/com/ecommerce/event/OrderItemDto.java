package com.ecommerce.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private Long productId;
    private Integer quantity;
    // Optional fields for notifications
    private String productName;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}
