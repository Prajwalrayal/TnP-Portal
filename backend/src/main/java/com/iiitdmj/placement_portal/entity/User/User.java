package com.iiitdmj.placement_portal.entity.User;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.iiitdmj.placement_portal.constants.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class User {
    @Id
    private String email;

    @Column(nullable = false)
    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private UserRole role;
    private String linkedinUrl;

    @NonNull
    private String password;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime lastLoginAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastLoginAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastLoginAt = LocalDateTime.now();
    }
}
