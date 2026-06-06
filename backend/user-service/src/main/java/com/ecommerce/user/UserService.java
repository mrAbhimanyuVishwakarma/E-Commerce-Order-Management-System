package com.ecommerce.user;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

/**
 * UserService
 * Explaining design decision: We separate business logic (Service) from the presentation layer (Controller)
 * and data access layer (Repository). This enforces the Single Responsibility Principle.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(false); // Default to false until OTP is verified
        return userRepository.save(user);
    }
    
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public String generateOtpForUser(User user) {
        // Generate a random 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtpCode(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        
        // MOCK EMAIL/SMS SENDING - Print to console
        System.out.println("=================================================");
        System.out.println("MOCK SMS/EMAIL SENT TO: " + user.getEmail() + (user.getMobileNumber() != null ? " / " + user.getMobileNumber() : ""));
        System.out.println("YOUR AXEDROBE VERIFICATION CODE IS: " + otp);
        System.out.println("=================================================");
        
        return otp;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> findByIdentifier(String identifier) {
        return userRepository.findByEmailOrMobileNumber(identifier, identifier);
    }
}
