package com.iiitdmj.placement_portal.entity;

import com.iiitdmj.placement_portal.constants.UserRole;
import jakarta.persistence.Entity;

@Entity
public class TprRole extends User {
    public TprRole() {}
    public TprRole(User user) {
        this.setEmail(user.getEmail());
        this.setFirstName(user.getFirstName());
        this.setLastName(user.getLastName());
        this.setPassword(user.getPassword());
        this.setRole(UserRole.TPR);
        this.setLinkedinUrl(user.getLinkedinUrl());
        this.setCreatedAt(user.getCreatedAt());
        this.setLastLoginAt(user.getLastLoginAt());
    }
}