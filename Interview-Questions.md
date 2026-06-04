# E-Commerce Order Management System - Interview Questions

This document contains common interview questions and answers based on the architecture, design patterns, and technologies used in this project. It is intended to help you prepare for discussions about this project during technical interviews.

## Core Java & Spring Boot

**Q1: Why did you choose Spring Boot for this project?**
> **Answer**: Spring Boot drastically reduces configuration boilerplate. It provides auto-configuration, embedded servers (Tomcat), and starter dependencies that make it easy to quickly stand up RESTful APIs and integrate with databases (JPA) and messaging queues (Kafka).

**Q2: Explain the `@RestController` annotation and how it differs from `@Controller`.**
> **Answer**: `@RestController` is a convenience annotation that combines `@Controller` and `@ResponseBody`. It indicates that the data returned by each method will be written straight into the response body (typically as JSON) instead of rendering a template/view.

**Q3: How is dependency injection handled in your services?**
> **Answer**: We use constructor injection via Lombok's `@RequiredArgsConstructor`. This ensures that dependencies are immutable (marked as `final`), makes it easier to write unit tests, and avoids the issues sometimes caused by field injection (`@Autowired`).

## Database & JPA

**Q4: What is the difference between Spring Data JPA and Hibernate?**
> **Answer**: Hibernate is an ORM (Object-Relational Mapping) framework that implements the JPA specification. Spring Data JPA is an abstraction layer on top of JPA providers (like Hibernate) that significantly reduces the amount of boilerplate code required to implement data access layers by generating repository implementations at runtime.

**Q5: Why did you use `schema.sql` instead of `spring.jpa.hibernate.ddl-auto=update` in the monolith phase?**
> **Answer**: Using `schema.sql` gives explicit, version-controllable scripts for database creation. Relying on Hibernate's `ddl-auto` is fine for quick prototypes, but in a production environment, database schema changes must be tightly controlled, usually via migration tools like Flyway or Liquibase.

## Security (JWT)

**Q6: How does JWT authentication work in your application?**
> **Answer**: When a user logs in with valid credentials, the server generates a JSON Web Token (JWT) signed with a secret key. This token is returned to the client. For subsequent requests, the client includes this token in the `Authorization: Bearer <token>` header. A custom `OncePerRequestFilter` (`JwtFilter`) intercepts requests, validates the signature and expiration of the token, and sets the `Authentication` context if valid. This makes the system stateless.

**Q7: Why use stateless JWTs instead of traditional Session IDs?**
> **Answer**: Stateless JWTs are much easier to scale in a microservices architecture. Since the token contains the user's identity and roles (and is cryptographically signed), any instance of any microservice can verify the user without needing to query a central session store (like Redis) or database.

## Architecture: Monolith vs Microservices

**Q8: Why did you build a monolith first before moving to microservices?**
> **Answer**: Starting with a monolith allowed me to firmly establish the domain model, business rules, and synchronous workflows (like Order -> Inventory) without the overhead of distributed systems. Once the domains were clear, extracting them into microservices was a matter of decoupling the communication rather than designing the business logic from scratch.

**Q9: What are the challenges of a microservices architecture?**
> **Answer**: Microservices introduce complexities such as distributed data management, network latency, eventual consistency, complex debugging/tracing, and deployment overhead. Managing transactions across services (e.g., if inventory reduction fails after an order is created) requires implementing patterns like the Saga pattern.

## Messaging & Apache Kafka

**Q10: Why did you introduce Kafka for the order processing flow?**
> **Answer**: In the initial monolith, creating an order made synchronous calls to Inventory and Notification. This tightly coupled the services and meant that if the Notification service was slow or down, order creation would fail or hang. By introducing Kafka, the Order service simply publishes an `order-created` event and returns a fast response to the user. Inventory and Notification services consume this event asynchronously at their own pace, improving system resilience and scalability.

**Q11: What happens if the Inventory service is down when an order is placed?**
> **Answer**: Because we use Kafka, the message is durably stored in the `order-created` topic. When the Inventory service comes back online, it will consume the message and process the stock reduction. No data is lost, though the system relies on *eventual consistency*.

## Docker & Containerization

**Q12: What is the benefit of using `docker-compose` for this project?**
> **Answer**: `docker-compose` allows us to define the entire multi-service ecosystem (5 microservices, MySQL, Zookeeper, Kafka) in a single YAML file. This guarantees that anyone can clone the repository and run `docker-compose up -d` to spin up the entire application in a consistent, isolated environment without needing to manually install Java, MySQL, or Kafka on their local machine.
