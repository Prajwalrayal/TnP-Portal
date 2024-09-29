package com.iiitdmj.placement_portal.entity;

import jakarta.persistence.Entity;

@Entity
public class StudentRole extends User {
    public StudentRole() {}
    public StudentRole(User user) {
        this.setEmail(user.getEmail());
        this.setFirstName(user.getFirstName());
        this.setLastName(user.getLastName());
        this.setPassword(user.getPassword());
        this.setRole(user.getRole());
        this.setLinkedinUrl(user.getLinkedinUrl());
        this.setCreatedAt(user.getCreatedAt());
        this.setLastLoginAt(user.getLastLoginAt());
    }
}