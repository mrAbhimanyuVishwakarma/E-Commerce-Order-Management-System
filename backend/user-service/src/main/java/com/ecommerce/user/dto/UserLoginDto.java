package com.ecommerce.user.dto;

import lombok.Data;

@Data
public class UserLoginDto {
    private String identifier;
    private String password;
}
