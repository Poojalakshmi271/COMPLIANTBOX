package com.compliantbox.dto;

import lombok.Data;

@Data
public class UpdateComplaintRequest {
    private String status;        // Pending | In Progress | Resolved | Rejected
    private String adminResponse;
}
