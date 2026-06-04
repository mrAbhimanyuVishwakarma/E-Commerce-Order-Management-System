package com.ecommerce.order.dto;

import lombok.Data;

@Data
public class OrderRequestDto {
    private Long userId;
    private Long productId;
    private Integer quantity;
}
