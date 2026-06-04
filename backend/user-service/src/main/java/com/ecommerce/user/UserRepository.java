package com.ecommerce.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository
 * Explaining design decision: Spring Data JPA provides implementation for common CRUD operations automatically.
 * We extend JpaRepository to get methods like save(), findById(), findAll() out of the box.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailOrMobileNumber(String email, String mobileNumber);
}
