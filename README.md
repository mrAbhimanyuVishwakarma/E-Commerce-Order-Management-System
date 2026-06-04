# E-Commerce Order Management System

## Project Overview

A microservices-based e-commerce backend application demonstrating:

* Java Backend Development
* Spring Boot
* REST APIs
* MySQL
* JPA/Hibernate
* Kafka Messaging
* JWT Authentication
* Microservices Architecture
* Docker (Optional)
* API Documentation


---

# Architecture

```text
+-------------------+
|      Client       |
|  Postman / UI     |
+---------+---------+
          |
          v
+-------------------+
|   API Requests    |
+---------+---------+
          |
          v

+-------------------+
|   User Service    |
+---------+---------+
          |
          |
          |
+---------v---------+
|  Product Service  |
+---------+---------+
          |
          |
          |
+---------v---------+
|   Order Service   |
+---------+---------+
          |
          | Publish Event
          v

      Kafka Topic
      order-created

          |
          |
+---------v---------+
| Inventory Service |
+-------------------+

          |
          |
+---------v---------+
|NotificationService|
+-------------------+
```

---

# Flowchart

```text
User Login
    |
    v
Generate JWT
    |
    v
Browse Products
    |
    v
Create Order
    |
    v
Save Order
    |
    v
Publish Kafka Event
(order-created)
    |
    +------------------+
    |                  |
    v                  v

Inventory Service   Notification Service
Update Stock        Send Confirmation

    |
    v
Order Completed
```

---

# Services

## 1. User Service

### Responsibilities

* User Registration
* Login
* JWT Generation
* Role Management

### Database

#### users

| Field    | Type   |
| -------- | ------ |
| id       | Long   |
| name     | String |
| email    | String |
| password | String |
| role     | String |

### APIs

```http
POST /api/auth/register

POST /api/auth/login

GET /api/users/profile
```

---

## 2. Product Service

### Responsibilities

* Product CRUD
* Product Search

### Database

#### products

| Field       | Type    |
| ----------- | ------- |
| id          | Long    |
| name        | String  |
| description | String  |
| price       | Double  |
| stock       | Integer |

### APIs

```http
POST /api/products

GET /api/products

GET /api/products/{id}

PUT /api/products/{id}

DELETE /api/products/{id}
```

---

## 3. Order Service

### Responsibilities

* Create Orders
* Order History
* Publish Kafka Events

### Database

#### orders

| Field       | Type   |
| ----------- | ------ |
| id          | Long   |
| userId      | Long   |
| totalAmount | Double |
| status      | String |

### APIs

```http
POST /api/orders

GET /api/orders

GET /api/orders/{id}
```

### Kafka Producer

Topic:

```text
order-created
```

Message:

```json
{
  "orderId": 1001,
  "userId": 1,
  "productId": 10,
  "quantity": 2
}
```

---

## 4. Inventory Service

### Responsibilities

* Consume Order Events
* Reduce Stock

### Kafka Consumer

Topic:

```text
order-created
```

Flow:

```text
Receive Event
    |
Check Stock
    |
Update Stock
    |
Save Changes
```

---

## 5. Notification Service

### Responsibilities

* Consume Order Events
* Send Notifications

### Kafka Consumer

Topic:

```text
order-created
```

Current Implementation

```text
Print notification to logs
```

Future Enhancement

```text
Email Notification
SMS Notification
```

---

# Project Structure

```text
E-Commerce-Order-Management-System

├── backend/
│   ├── user-service/
│   ├── product-service/
│   ├── order-service/
│   ├── inventory-service/
│   └── notification-service/
│
├── frontend/
│   └── (React Application)
│
├── docs/
│   ├── Interview-Questions.md
│   └── E-Commerce-Postman-Collection.json
│
├── archive/
│   └── ecommerce-monolith/
│
├── docker-compose.yml
└── README.md
```

---

# Tech Stack

## Backend

* Java 17
* Spring Boot 3

## Database

* MySQL

## Messaging

* Apache Kafka

## Security

* Spring Security
* JWT

## ORM

* Spring Data JPA
* Hibernate

## Build Tool

* Maven

## API Testing

* Postman

## Documentation

* Swagger/OpenAPI

---

# Development Phases

## Phase 1

Build Monolith First

### Deliverables

* User APIs
* Product APIs
* Order APIs
* MySQL Integration

Reason:

Learn Spring Boot fundamentals before microservices.

---

## Phase 2

Add Security

### Deliverables

* JWT Authentication
* Login
* Role-Based Access

Roles:

```text
ADMIN
CUSTOMER
```

---

## Phase 3

Introduce Kafka

### Deliverables

* Producer
* Consumer
* Event Publishing

Topic:

```text
order-created
```

---

## Phase 4

Split Into Microservices

### Deliverables

* User Service
* Product Service
* Order Service
* Inventory Service
* Notification Service

---

## Phase 5

Dockerize

### Deliverables

```text
docker-compose.yml

MySQL
Kafka
Zookeeper
All Services
```

---
