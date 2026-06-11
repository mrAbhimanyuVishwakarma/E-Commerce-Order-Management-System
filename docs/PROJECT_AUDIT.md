# E-Commerce Order Management System - Project Audit

## Current Repository Structure
The repository contains a multi-service backend, a React frontend, and a root directory with deployment/startup scripts.

*   `backend/`: Contains five Spring Boot microservices:
    *   `user-service`: User registration, authentication, JWT.
    *   `product-service`: Product catalogue.
    *   `order-service`: Order creation and Kafka publishing.
    *   `inventory-service`: Subscribed to Kafka, barebones logic.
    *   `notification-service`: Subscribed to Kafka, barebones logic.
*   `frontend/`: React application using Vite, with context, components, and pages.
*   `docs/`: Contains Postman collections and interview questions.
*   `docker-compose.yml`: For spinning up MySQL, Zookeeper, Kafka, and all services.
*   `start.bat`: A startup script for Windows.

## Current Architecture
*   **Frontend**: React client making direct REST API calls to backend services.
*   **Backend Services**: Five independent Spring Boot 3 / Java 17 services. No API Gateway or service discovery is present.
*   **Database**: A single MySQL container with multiple schemas (e.g., `ecommerce_user_db`, `ecommerce_product_db`).
*   **Messaging**: Apache Kafka used for asynchronous communication from `order-service` to `inventory-service` and `notification-service`.

## Feature Status

### Implemented Features
*   **User Service**: Basic user registration and login endpoints (JWT filter present).
*   **Product Service**: Basic CRUD operations for products (Controller, Service, Repository exist).
*   **Order Service**: Basic order creation endpoint. Publishes `order-created` event to Kafka.
*   **Frontend**: UI pages for Home, Products, ProductDetail, Cart, Auth, and Orders.

### Partially Implemented Features
*   **Inventory Service**: Contains a Kafka listener for `order-created` events but only prints to the console. No database, repository, or actual stock reduction logic exists.
*   **Notification Service**: Contains a Kafka listener but only prints to the console.

### Features Mentioned in Documentation but Missing from Code
*   **Email/SMS Notifications**: The documentation mentions these as "Future Enhancements" but current implementation is just a console log.
*   **Complete Order Flow**: The documentation shows an "Order Completed" step after Inventory updates stock, but in code, the `OrderService` does not listen for a response from `InventoryService` and just assumes the order is done.

## Issues by Category

### Database-Design Issues
*   **CRITICAL**: `Order` entity does not have an `OrderItem` relationship. It only stores `totalAmount` and `userId`. It is impossible to know what products were purchased.
*   **CRITICAL**: `Product` entity contains a `stock` field. This conflicts with the goal of `inventory-service` being the single source of truth for stock.
*   **HIGH**: Monetary values (`price` in `Product`, `totalAmount` in `Order`) are stored as `Double` instead of `BigDecimal`, which can lead to precision loss.
*   **HIGH**: `Order` status is saved immediately without waiting for inventory reservation.

### Kafka Reliability Issues
*   **CRITICAL**: No bidirectional event flow. `order-service` fires and forgets. If inventory is insufficient, the order is not rolled back or rejected.
*   **HIGH**: No idempotency or duplicate-event protection in `inventory-service` or `notification-service`.
*   **HIGH**: No Dead Letter Queue (DLQ) or retry mechanisms.
*   **HIGH**: No Outbox pattern implemented for safe event publishing.

### Security Issues
*   **CRITICAL**: Hardcoded credentials in `docker-compose.yml` (`MYSQL_ROOT_PASSWORD: root`, and datasource passwords).
*   **HIGH**: CORS is likely unrestricted or directly tied to localhost without environment variability.
*   **HIGH**: JWT token handling in the frontend might be insecure (needs review).
*   **HIGH**: Lack of environment-specific profiles (e.g., `application-dev.yml`, `application-prod.yml`).

### Deployment & Docker Issues
*   **HIGH**: `start.bat` uses the outdated `docker-compose` command instead of `docker compose`.
*   **HIGH**: `start.bat` does not adequately check health statuses before declaring success.
*   **HIGH**: `docker-compose.yml` lacks `healthcheck` configurations for dependencies like MySQL and Kafka. Services might crash on startup if dependencies aren't ready.

### Frontend Issues
*   **HIGH**: Likely using hardcoded `localhost` URLs for APIs instead of environment variables.
*   **MEDIUM**: Loading states, error handling, and timeout handling might be insufficient (to be verified in code).

### Test Coverage Status
*   **HIGH**: Almost zero test coverage. Found only `AuthTestController` and `ExceptionTestController` in `product-service`. No unit tests or integration tests for core business logic, validations, or Kafka flows. No frontend tests found.

## Prioritized Implementation Plan

1.  **Phase 1: Domain and Database Correction (CRITICAL)**
    *   Introduce `OrderItem` entity to `order-service`.
    *   Change `Double` to `BigDecimal` for prices.
    *   Migrate stock ownership to `inventory-service` and establish it as the source of truth.
2.  **Phase 2: Reliable Order & Inventory Flow (CRITICAL)**
    *   Implement PENDING -> CONFIRMED/REJECTED state machine in `order-service`.
    *   Implement `inventory-reservation-requested` and `inventory-reserved`/`inventory-rejected` events.
    *   Implement idempotent Kafka consumers.
3.  **Phase 3: Service Communication (HIGH)**
    *   Implement REST calls for price fetching (Order -> Product).
    *   Add timeouts, error handling, and typed DTOs.
4.  **Phase 4: Security Corrections (HIGH)**
    *   Implement proper BCrypt password hashing and role-based access.
    *   Move secrets to `.env` files and out of source control.
    *   Configure environment-specific profiles and restrict CORS.
5.  **Phase 5: Docker and Startup Automation (MEDIUM)**
    *   Update `docker-compose.yml` with health checks.
    *   Update `start.bat` to use `docker compose` and verify health properly.
6.  **Phase 6: Frontend Improvements (MEDIUM)**
    *   Configure `frontend/.env.example`.
    *   Implement reusable API clients with proper error handling.
7.  **Phase 7: API Error Handling & Validation (MEDIUM)**
    *   Add `@RestControllerAdvice` and standard error responses.
8.  **Phase 8: Testing (HIGH)**
    *   Add unit and integration tests across services.
    *   Add frontend tests.
9.  **Phase 9: Observability (LOW)**
    *   Add Actuator and logging correlation IDs.
10. **Phase 10: Documentation & Deployment Readiness (MEDIUM)**
    *   Update `README.md`, add required markdown docs (`DEPLOYMENT.md`, etc.).
    *   Verify health endpoints and provide deployment instructions.
