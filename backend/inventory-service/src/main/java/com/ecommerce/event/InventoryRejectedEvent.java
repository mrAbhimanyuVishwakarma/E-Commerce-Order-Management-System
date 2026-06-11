package com.ecommerce.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class InventoryRejectedEvent extends BaseEvent {
    private List<OrderItemDto> items;
    private String reasonCode;
    private String reasonMessage;
}
