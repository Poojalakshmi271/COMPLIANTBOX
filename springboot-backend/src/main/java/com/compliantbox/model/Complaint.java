package com.compliantbox.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Category category = Category.Other;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.Medium;

    @Enumerated(EnumType.STRING)
    private Status status = Status.Pending;

    private boolean isAnonymous = false;

    // null if anonymous — mirrors MongoDB nullable ObjectId ref
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String adminResponse;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Category { HR, IT, Facilities, Other }
    public enum Priority { Low, Medium, High, Critical }
    public enum Status { Pending, InProgress, Resolved, Rejected }
}
