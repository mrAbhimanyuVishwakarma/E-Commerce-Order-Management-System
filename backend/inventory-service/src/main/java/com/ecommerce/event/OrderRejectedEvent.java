package com.ecommerce.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OrderRejectedEvent extends BaseEvent {
    private String status;
    private String reasonCode;
    private String reasonMessage;
}
