package com.iiitdmj.placement_portal.dto;

import com.iiitdmj.placement_portal.entity.User.User;
import com.iiitdmj.placement_portal.constants.UserRole;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {

    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private String linkedinUrl;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    public
    UserResponse(User user) {
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.role = user.getRole();
        this.linkedinUrl = user.getLinkedinUrl();
        this.createdAt = user.getCreatedAt();
        this.lastLoginAt = user.getLastLoginAt();
    }
}
