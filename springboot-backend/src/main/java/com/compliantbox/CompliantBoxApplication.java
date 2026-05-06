package com.compliantbox;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class CompliantBoxApplication {
    public static void main(String[] args) {
        SpringApplication.run(CompliantBoxApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "CompliantBox Backend is UP and RUNNING!";
    }
}
