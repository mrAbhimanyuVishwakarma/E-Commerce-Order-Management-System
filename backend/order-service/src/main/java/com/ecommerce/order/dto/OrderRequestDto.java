package com.ecommerce.order.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDto {
    /**
     * @deprecated Replaced by extracting user from JWT. Do not trust this value.
     */
    @Deprecated
    private Long userId;
    
    /**
     * @deprecated Use items list instead.
     */
    @Deprecated
    private Long productId;
    
    /**
     * @deprecated Use items list instead.
     */
    @Deprecated
    private Integer quantity;

    private List<OrderItemRequestDto> items;
}
