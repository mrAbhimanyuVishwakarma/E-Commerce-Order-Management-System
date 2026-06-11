package com.ecommerce.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class InventoryReservedEvent extends BaseEvent {
    private List<OrderItemDto> items;
}
