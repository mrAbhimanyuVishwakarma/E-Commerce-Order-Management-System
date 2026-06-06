package com.ecommerce.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User Entity
 * Explaining design decision: We use JPA annotations to map this class to the 'users' table.
 * Lombok's @Data is used to generate getters, setters, equals, hashCode, and toString methods automatically, reducing boilerplate code.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true, unique = true)
    private String mobileNumber;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // "ADMIN" or "CUSTOMER"

    @Column(nullable = true)
    private String otpCode;

    @Column(nullable = true)
    private java.time.LocalDateTime otpExpiry;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isVerified;
}
