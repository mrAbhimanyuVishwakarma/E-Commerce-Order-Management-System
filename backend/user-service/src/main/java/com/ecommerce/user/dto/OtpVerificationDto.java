package com.ecommerce.user.dto;

import lombok.Data;

@Data
public class OtpVerificationDto {
    private String identifier; // email or mobile
    private String otp;
}
