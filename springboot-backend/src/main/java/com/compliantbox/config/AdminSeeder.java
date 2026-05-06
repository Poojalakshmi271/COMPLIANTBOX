package com.compliantbox.config;

import com.compliantbox.model.User;
import com.compliantbox.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * AdminSeeder — equivalent to the Node.js seedAdmin.js script.
 * Runs automatically on startup. Creates a default admin account
 * if one does not already exist.
 *
 * Default credentials:
 *   Email:    admin@company.com
 *   Password: admin123
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
        String adminEmail = "admin@company.com";

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.admin);
            userRepository.save(admin);
            System.out.println("✅ Default admin seeded: " + adminEmail + " / admin123");
        } else {
            System.out.println("ℹ️  Admin already exists, skipping seed.");
        }
    }
}
