package com.compliantbox.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Auth response — matches the exact JSON shape returned by the Node.js backend:
 * { _id, name, email, role, token }
 * Using _id to keep full compatibility with the React frontend.
 */
@Data
@AllArgsConstructor
public class AuthResponse {
    private Long _id;
    private String name;
    private String email;
    private String role;
    private String token;
}
