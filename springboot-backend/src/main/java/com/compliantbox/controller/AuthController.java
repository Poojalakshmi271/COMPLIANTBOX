package com.compliantbox.controller;

import com.compliantbox.dto.AuthResponse;
import com.compliantbox.dto.LoginRequest;
import com.compliantbox.dto.RegisterRequest;
import com.compliantbox.model.User;
import com.compliantbox.repository.UserRepository;
import com.compliantbox.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Auth controller — mirrors Node.js /api/auth routes exactly:
 *   POST /api/auth/register
 *   POST /api/auth/login
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(req.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "User already exists"));
            }

            // Hash password using BCrypt (compatible with bcryptjs salt=10)
            String hashedPassword = passwordEncoder.encode(req.getPassword());

            // Determine role
            User.Role role = User.Role.employee;
            if (req.getRole() != null && req.getRole().equals("admin")) {
                role = User.Role.admin;
            }

            // Save user
            User user = new User();
            user.setName(req.getName());
            user.setEmail(req.getEmail());
            user.setPassword(hashedPassword);
            user.setRole(role);
            userRepository.save(user);

            // Generate JWT and return same shape as Node.js
            String token = jwtUtil.generateToken(user.getId(), user.getRole().name());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), token));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(req.getEmail());

            if (userOpt.isPresent() &&
                    passwordEncoder.matches(req.getPassword(), userOpt.get().getPassword())) {

                User user = userOpt.get();
                String token = jwtUtil.generateToken(user.getId(), user.getRole().name());

                return ResponseEntity.ok(
                        new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), token)
                );
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
