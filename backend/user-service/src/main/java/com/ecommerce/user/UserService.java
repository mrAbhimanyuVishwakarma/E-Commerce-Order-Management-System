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
        if (user.getOtpLastSentAt() != null && user.getOtpLastSentAt().plusMinutes(1).isAfter(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Please wait before requesting a new OTP.");
        }
        
        // Generate a random 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtpCode(passwordEncoder.encode(otp)); // Hash the OTP
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(5));
        user.setOtpAttempts(0);
        user.setOtpLastSentAt(java.time.LocalDateTime.now());
        userRepository.save(user);
        
        // In a real app we'd send an email/SMS here.
        // We do NOT log the OTP to the console as per security requirements.
        
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
