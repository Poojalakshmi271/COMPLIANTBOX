package com.compliantbox.config;

import com.compliantbox.model.User;
import com.compliantbox.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * AdminSeeder — creates default admin accounts on startup.
 * Seeds two admins:
 *   1. admin@company.com / admin123
 *   2. dp27@gmail.com    / admin123
 * If accounts already exist, their role is always forced to admin
 * so they cannot be accidentally downgraded.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdmin("Admin",       "admin@company.com", "admin123");
        seedAdmin("Admin User",  "dp27@gmail.com",    "admin123");
    }

    private void seedAdmin(String name, String email, String rawPassword) {
        userRepository.findByEmail(email).ifPresentOrElse(
            existing -> {
                // Force role to admin in case it was downgraded
                if (existing.getRole() != User.Role.admin) {
                    existing.setRole(User.Role.admin);
                    userRepository.save(existing);
                    System.out.println("✅ Admin role fixed for: " + email);
                } else {
                    System.out.println("ℹ️  Admin already exists: " + email);
                }
            },
            () -> {
                User admin = new User();
                admin.setName(name);
                admin.setEmail(email);
                admin.setPassword(passwordEncoder.encode(rawPassword));
                admin.setRole(User.Role.admin);
                userRepository.save(admin);
                System.out.println("✅ Admin seeded: " + email + " / " + rawPassword);
            }
        );
    }
}
