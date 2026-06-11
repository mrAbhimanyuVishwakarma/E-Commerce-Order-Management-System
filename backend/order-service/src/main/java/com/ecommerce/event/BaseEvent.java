package com.ecommerce.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEvent {
    private String eventId;
    private String eventType;
    private Integer eventVersion;
    private String correlationId;
    private LocalDateTime occurredAt;
    private Long orderId;
    private Long userId;
}
