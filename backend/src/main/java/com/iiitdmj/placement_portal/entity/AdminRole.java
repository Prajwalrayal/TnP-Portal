package com.iiitdmj.placement_portal.entity;

import com.iiitdmj.placement_portal.constants.UserRole;
import jakarta.persistence.Entity;

@Entity
public class AdminRole extends User {
    public AdminRole() {}
    public AdminRole(User user) {
        this.setEmail(user.getEmail());
        this.setFirstName(user.getFirstName());
        this.setLastName(user.getLastName());
        this.setPassword(user.getPassword());
        this.setRole(UserRole.ADMIN);
        this.setLinkedinUrl(user.getLinkedinUrl());
        this.setCreatedAt(user.getCreatedAt());
        this.setLastLoginAt(user.getLastLoginAt());
    }
}