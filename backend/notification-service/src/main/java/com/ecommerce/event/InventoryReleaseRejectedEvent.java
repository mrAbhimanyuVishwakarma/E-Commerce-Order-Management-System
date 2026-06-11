package com.ecommerce.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class InventoryReleaseRejectedEvent extends BaseEvent {
    private String reasonCode;
    private String reasonMessage;
}
