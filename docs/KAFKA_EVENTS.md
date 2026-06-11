# Kafka Events Contract

This document outlines the standard schema for all Kafka events used in the E-Commerce Order Management System.

## Standard Event Envelope
Every event must include the following base fields:
```json
{
  "eventId": "UUID",
  "eventType": "String",
  "eventVersion": "Integer",
  "correlationId": "UUID",
  "occurredAt": "ISO-8601 Timestamp",
  "orderId": "Long",
  "userId": "Long"
}
```

---

## 1. InventoryReservationRequestedEvent
Published by the **Order Service** (via Outbox) when an order is created and pending inventory reservation.
- **Topic**: `inventory-reservation-requested`
- **Items**: List of products and requested quantities.

```json
{
  "eventId": "123e4567-e89b-12d3-a456-426614174000",
  "eventType": "InventoryReservationRequestedEvent",
  "eventVersion": 1,
  "correlationId": "123e4567-e89b-12d3-a456-426614174000",
  "occurredAt": "2026-06-12T01:45:00Z",
  "orderId": 1001,
  "userId": 501,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

---

## 2. InventoryReservedEvent
Published by the **Inventory Service** when stock is successfully reserved for all items in an order.
- **Topic**: `inventory-reserved`

```json
{
  "eventId": "223e4567-e89b-12d3-a456-426614174001",
  "eventType": "InventoryReservedEvent",
  "eventVersion": 1,
  "correlationId": "123e4567-e89b-12d3-a456-426614174000",
  "occurredAt": "2026-06-12T01:45:01Z",
  "orderId": 1001,
  "userId": 501,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

---

## 3. InventoryRejectedEvent
Published by the **Inventory Service** when stock reservation fails (e.g., insufficient stock, product not found).
- **Topic**: `inventory-rejected`

```json
{
  "eventId": "323e4567-e89b-12d3-a456-426614174002",
  "eventType": "InventoryRejectedEvent",
  "eventVersion": 1,
  "correlationId": "123e4567-e89b-12d3-a456-426614174000",
  "occurredAt": "2026-06-12T01:45:01Z",
  "orderId": 1001,
  "userId": 501,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "reasonCode": "INSUFFICIENT_STOCK",
  "reasonMessage": "Not enough stock for product 1"
}
```

---

## 4. OrderConfirmedEvent
Published by the **Order Service** (via Outbox) after consuming `InventoryReservedEvent` and updating the order status to `CONFIRMED`. Consumed by the Notification Service.
- **Topic**: `order-confirmed`

```json
{
  "eventId": "423e4567-e89b-12d3-a456-426614174003",
  "eventType": "OrderConfirmedEvent",
  "eventVersion": 1,
  "correlationId": "123e4567-e89b-12d3-a456-426614174000",
  "occurredAt": "2026-06-12T01:45:02Z",
  "orderId": 1001,
  "userId": 501,
  "totalAmount": 19.98,
  "status": "CONFIRMED",
  "items": [
    {
      "productId": 1,
      "productName": "Sample Product",
      "quantity": 2,
      "unitPrice": 9.99,
      "subtotal": 19.98
    }
  ]
}
```

---

## 5. OrderRejectedEvent
Published by the **Order Service** (via Outbox) after consuming `InventoryRejectedEvent` and updating the order status to `REJECTED`. Consumed by the Notification Service.
- **Topic**: `order-rejected`

```json
{
  "eventId": "523e4567-e89b-12d3-a456-426614174004",
  "eventType": "OrderRejectedEvent",
  "eventVersion": 1,
  "correlationId": "123e4567-e89b-12d3-a456-426614174000",
  "occurredAt": "2026-06-12T01:45:02Z",
  "orderId": 1001,
  "userId": 501,
  "status": "REJECTED",
  "reasonCode": "INSUFFICIENT_STOCK",
  "reasonMessage": "Not enough stock for product 1"
}
```

---

## 6. InventoryReleaseRequestedEvent
Published by the **Order Service** (via Outbox) when a confirmed order is cancelled, requesting the inventory to be released back to available stock.
- **Topic**: `inventory-release-requested`

```json
{
  "eventId": "623e4567-e89b-12d3-a456-426614174005",
  "eventType": "InventoryReleaseRequestedEvent",
  "eventVersion": 1,
  "correlationId": "123e4567-e89b-12d3-a456-426614174000",
  "occurredAt": "2026-06-12T01:46:00Z",
  "orderId": 1001,
  "userId": 501,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

---

## 7. InventoryReleasedEvent
Published by the **Inventory Service** upon successful release of previously reserved inventory.
- **Topic**: `inventory-released`

```json
{
  "eventId": "723e4567-e89b-12d3-a456-426614174006",
  "eventType": "InventoryReleasedEvent",
  "eventVersion": 1,
  "correlationId": "123e4567-e89b-12d3-a456-426614174000",
  "occurredAt": "2026-06-12T01:46:01Z",
  "orderId": 1001,
  "userId": 501,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

---

## 8. InventoryReleaseRejectedEvent
Published by the **Inventory Service** if a release request is invalid (e.g., reservation not found).
- **Topic**: `inventory-release-rejected`

```json
{
  "eventId": "823e4567-e89b-12d3-a456-426614174007",
  "eventType": "InventoryReleaseRejectedEvent",
  "eventVersion": 1,
  "correlationId": "123e4567-e89b-12d3-a456-426614174000",
  "occurredAt": "2026-06-12T01:46:01Z",
  "orderId": 1001,
  "userId": 501,
  "reasonCode": "RESERVATION_NOT_FOUND",
  "reasonMessage": "No reservation found for order 1001"
}
```
