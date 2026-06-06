package com.ecommerce.product;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth-test")
public class AuthTestController {

    @GetMapping
    public ResponseEntity<String> getAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.ok("No auth");
        }
        return ResponseEntity.ok("User: " + auth.getName() + " Roles: " + auth.getAuthorities());
    }
}
