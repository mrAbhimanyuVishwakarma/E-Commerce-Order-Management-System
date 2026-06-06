package com.ecommerce.product;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/exception-test")
public class ExceptionTestController {

    @GetMapping
    public ResponseEntity<String> getLastException() {
        return ResponseEntity.ok(GlobalExceptionHandler.lastException);
    }
}
