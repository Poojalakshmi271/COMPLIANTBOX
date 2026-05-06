package com.compliantbox;

import com.compliantbox.model.User;
import com.compliantbox.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class CompliantBoxApplication {
    public static void main(String[] args) {
        SpringApplication.run(CompliantBoxApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "dp27@gmail.com";
            if (userRepository.findByEmail(email).isEmpty()) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail(email);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(User.Role.admin);
                userRepository.save(admin);
                System.out.println("Admin user seeded successfully!");
            } else {
                User admin = userRepository.findByEmail(email).get();
                admin.setRole(User.Role.admin);
                userRepository.save(admin);
                System.out.println("Admin role verified for " + email);
            }
        };
    }

    @GetMapping("/")
    public String home() {
        return "CompliantBox Backend is UP and RUNNING!";
    }
}
