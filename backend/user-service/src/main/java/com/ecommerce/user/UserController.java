package com.ecommerce.user;

import com.ecommerce.security.JwtUtil;
import com.ecommerce.user.dto.UserLoginDto;
import com.ecommerce.user.dto.UserRegistrationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import com.ecommerce.user.dto.OtpVerificationDto;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDto dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setMobileNumber(dto.getMobileNumber());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole() != null ? dto.getRole() : "CUSTOMER");
        
        user = userService.registerUser(user);
        userService.generateOtpForUser(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered. OTP sent to your email/mobile.");
        response.put("requiresOtp", true);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto dto) {
        // Authenticate password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getIdentifier(), dto.getPassword())
        );

        // Instead of returning JWT, generate OTP
        Optional<User> userOpt = userService.findByIdentifier(dto.getIdentifier());
        if (userOpt.isPresent()) {
            userService.generateOtpForUser(userOpt.get());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Credentials verified. OTP sent to your email/mobile.");
            response.put("requiresOtp", true);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(Map.of("message", "Authentication failed"));
    }

    @PostMapping("/auth/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationDto dto) {
        Optional<User> userOpt = userService.findByIdentifier(dto.getIdentifier());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getOtpCode() != null && user.getOtpCode().equals(dto.getOtp())) {
                if (user.getOtpExpiry() != null && java.time.LocalDateTime.now().isBefore(user.getOtpExpiry())) {
                    // OTP is valid
                    user.setOtpCode(null);
                    user.setOtpExpiry(null);
                    user.setVerified(true);
                    userService.updateUser(user);
                    
                    // Generate JWT token
                    UserDetails userDetails = userDetailsService.loadUserByUsername(dto.getIdentifier());
                    String jwt = jwtUtil.generateToken(userDetails);
                    return ResponseEntity.ok(Map.of("token", jwt));
                } else {
                    return ResponseEntity.status(400).body(Map.of("message", "OTP has expired"));
                }
            } else {
                return ResponseEntity.status(400).body(Map.of("message", "Invalid OTP"));
            }
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
    }

    @GetMapping("/users/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        // Fetch profile based on currently authenticated user
        String email = authentication.getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        return ResponseEntity.status(409).body(Map.of("message", "Registration failed: Email or Mobile number already exists in our system."));
    }
}
