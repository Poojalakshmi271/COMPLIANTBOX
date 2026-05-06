package com.compliantbox.controller;

import com.compliantbox.dto.ComplaintRequest;
import com.compliantbox.dto.ComplaintResponse;
import com.compliantbox.dto.UpdateComplaintRequest;
import com.compliantbox.model.Complaint;
import com.compliantbox.model.User;
import com.compliantbox.repository.ComplaintRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Complaint controller — mirrors Node.js /api/complaints routes exactly:
 *   POST   /api/complaints         → create complaint (protected, employee)
 *   GET    /api/complaints/my      → get user's own complaints (protected)
 *   GET    /api/complaints         → get all complaints (protected, admin)
 *   PUT    /api/complaints/:id     → update status/response (protected, admin)
 */
@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintRepository complaintRepository;

    public ComplaintController(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    // POST /api/complaints — create new complaint
    @PostMapping
    public ResponseEntity<?> createComplaint(@RequestBody ComplaintRequest req,
                                              @AuthenticationPrincipal User currentUser) {
        try {
            Complaint complaint = new Complaint();
            complaint.setTitle(req.getTitle());
            complaint.setDescription(req.getDescription());

            // Parse enums safely, default to Other/Medium if invalid
            try { complaint.setCategory(Complaint.Category.valueOf(req.getCategory())); }
            catch (Exception e) { complaint.setCategory(Complaint.Category.Other); }

            try { complaint.setPriority(Complaint.Priority.valueOf(req.getPriority())); }
            catch (Exception e) { complaint.setPriority(Complaint.Priority.Medium); }

            complaint.setAnonymous(req.isAnonymous());

            // Mirror: user = isAnonymous ? null : req.user.id
            complaint.setUser(req.isAnonymous() ? null : currentUser);

            Complaint saved = complaintRepository.save(complaint);
            return ResponseEntity.status(HttpStatus.CREATED).body(ComplaintResponse.from(saved));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // GET /api/complaints/my — get current user's complaints
    @GetMapping("/my")
    public ResponseEntity<?> getMyComplaints(@AuthenticationPrincipal User currentUser) {
        try {
            List<ComplaintResponse> complaints = complaintRepository
                    .findByUserOrderByCreatedAtDesc(currentUser)
                    .stream()
                    .map(ComplaintResponse::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // GET /api/complaints — admin: get all complaints
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllComplaints() {
        try {
            List<ComplaintResponse> complaints = complaintRepository
                    .findAllByOrderByCreatedAtDesc()
                    .stream()
                    .map(ComplaintResponse::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // PUT /api/complaints/:id — admin: update status and/or adminResponse
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateComplaint(@PathVariable Long id,
                                              @RequestBody UpdateComplaintRequest req) {
        try {
            Optional<Complaint> opt = complaintRepository.findById(id);
            if (opt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Complaint not found"));
            }

            Complaint complaint = opt.get();

            if (req.getStatus() != null) {
                // Normalize "In Progress" → "InProgress" for enum parsing
                String normalized = req.getStatus().replace("In Progress", "InProgress");
                try { complaint.setStatus(Complaint.Status.valueOf(normalized)); }
                catch (Exception ignored) {}
            }

            if (req.getAdminResponse() != null) {
                complaint.setAdminResponse(req.getAdminResponse());
            }

            Complaint updated = complaintRepository.save(complaint);
            return ResponseEntity.ok(ComplaintResponse.from(updated));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
