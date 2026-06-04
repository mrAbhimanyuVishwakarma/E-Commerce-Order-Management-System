package com.ecommerce.user.dto;

import lombok.Data;

/**
 * User Registration DTO
 * Explaining design decision: Data Transfer Objects (DTOs) hide implementation details of entities
 * and prevent over-posting vulnerabilities.
 */
@Data
public class UserRegistrationDto {
    private String name;
    private String email;
    private String mobileNumber;
    private String password;
    private String role;
}
