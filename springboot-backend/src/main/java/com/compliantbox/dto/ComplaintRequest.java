package com.compliantbox.dto;

import lombok.Data;

@Data
public class ComplaintRequest {
    private String title;
    private String description;
    private String category;   // HR | IT | Facilities | Other
    private String priority;   // Low | Medium | High | Critical
    private boolean isAnonymous;
}
