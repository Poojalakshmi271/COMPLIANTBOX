package com.compliantbox.dto;

import com.compliantbox.model.Complaint;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Complaint response DTO.
 * Mirrors the Mongoose JSON response shape expected by the React frontend.
 * Uses _id for compatibility.
 */
@Data
public class ComplaintResponse {
    private Long _id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private boolean isAnonymous;
    private UserSummary user;   // null if anonymous
    private String adminResponse;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class UserSummary {
        private Long _id;
        private String name;
        private String email;
    }

    public static ComplaintResponse from(Complaint c) {
        ComplaintResponse dto = new ComplaintResponse();
        dto._id = c.getId();
        dto.title = c.getTitle();
        dto.description = c.getDescription();
        dto.category = c.getCategory().name();
        dto.priority = c.getPriority().name();
        dto.status = c.getStatus().name().replace("InProgress", "In Progress");
        dto.isAnonymous = c.isAnonymous();
        dto.adminResponse = c.getAdminResponse();
        dto.createdAt = c.getCreatedAt();
        dto.updatedAt = c.getUpdatedAt();

        if (c.getUser() != null) {
            UserSummary us = new UserSummary();
            us._id = c.getUser().getId();
            us.name = c.getUser().getName();
            us.email = c.getUser().getEmail();
            dto.user = us;
        }

        return dto;
    }
}
